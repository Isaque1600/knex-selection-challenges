import { PaymentBody } from "@/Interfaces/PaymentAdapter";
import { API_URL, chave_pix } from "@/Lib/envVariables";
import { prisma } from "@/Lib/prisma";
import { MercadoPagoAdapter } from "@/Services/MercadoPagoAdapter";
import { PaymentClient } from "@/Services/PaymentCLient";
import { Prisma, Status } from "@prisma/client";
import { addDays, addMinutes, formatDate } from "date-fns";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { Doacao } from "../Models/Doacao";
import { Doador } from "../Models/Doador";
import { Pagamento } from "../Models/Pagamento";

const paymentStatus: { [key: string]: string } = {
  pending: Status.PENDENTE,
  approved: Status.CONFIRMADO,
  cancelled: Status.CANCELADO,
};

export class DoacaoRepository {
  static async createDoacao({ valor, mensagem, doadorId }: { valor: number; mensagem?: string; doadorId: string }) {
    return await prisma.$transaction(async (tx) => {
      const doador = await Doador.get(doadorId);

      if (!doador) {
        throw new Error("Doador nao encontrado");
      }

      const doacao = await Doacao.create({ valor, mensagem, doadorId }, tx);

      if (!doacao) {
        throw new Error("Não foi possivel criar a doacao");
      }

      const currentDate = new Date();
      const date = formatDate(addDays(currentDate, 1), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

      const body: PaymentBody = {
        transaction_amount: Number(doacao.valor),
        description: doacao.mensagem || undefined,
        date_of_expiration: date,
        notification_url: `${API_URL}/doacao/${doacao.id}`,
        payer: {
          email: doador.email,
        },
      };

      const idempotencyKey = `${doacao.id}-${Date.now()}`;

      const paymentClient = new PaymentClient(new MercadoPagoAdapter());

      const payment = (await paymentClient.createPayment(body, idempotencyKey)) as PaymentResponse;

      if (!payment) {
        throw new Error("Nao foi possivel criar o pagamento");
      }

      const qr_code = {
        qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
      };

      const pagamento = await Pagamento.create(
        {
          paymentId: payment.id!.toString(),
          chave_pix: chave_pix || "",
          doacaoId: doacao.id,
          qr_code: qr_code.qr_code_base64 || "",
          status: paymentStatus[payment.status!] as Status,
          data_criacao: payment.date_created,
          data_expiracao: addMinutes(new Date(), 5),
          data_confirmacao: payment.date_approved,
        },
        tx,
      );

      return { doacao: doacao, pagamento: { qr_code } };
    });
  }

  static async getDoacao(id: string) {
    const doacao = Doacao.get(id);

    if (!doacao) {
      throw new Error("Doacao nao encontrada");
    }

    return doacao;
  }

  static async getDoacaoAndPagamento(id: string) {
    const doacao = Doacao.get(id);

    if (!doacao) {
      throw new Error("Doacao nao encontrada");
    }

    const pagamento = Pagamento.getByDoacaoId(id);

    if (!pagamento) {
      throw new Error("Pagamento nao encontrado");
    }

    const result = await Promise.all([doacao, pagamento]);

    return { doacao: result[0], pagamento: result[1] };
  }

  static async updateDoacao(
    doacaoId: string,
    { valor, mensagem, doadorId }: { valor?: number; mensagem?: string; doadorId?: string },
  ) {
    const doacao = await Doacao.get(doacaoId);

    if (doacao.status === Status.CONFIRMADO) {
      return {
        message: "Pagamento da doacao ja confirmado",
        code: Status.CONFIRMADO,
      };
    }

    if (doacao.status === Status.EXPIRADO) {
      return {
        message: "Pagamento da doacao expirado",
        code: Status.EXPIRADO,
      };
    }

    if (doacao.status === Status.CANCELADO) {
      return {
        message: "Pagamento da doacao cancelado, não é possível alterar o valor",
        code: Status.CANCELADO,
      };
    }

    const updatedDoacao = await Doacao.update(doacaoId, { valor, mensagem, doadorId });

    return { message: "Doacao atualizada com sucesso", code: "OK", doacao: updatedDoacao };
  }

  static async realizarPagamento(doacaoId: string) {
    const { doacao, pagamento } = await this.getDoacaoAndPagamento(doacaoId);

    if (!doacao || !pagamento) {
      throw new Error("Doacao nao encontrada");
    }

    if (pagamento.status === Status.CONFIRMADO) {
      return {
        message: "Pagamento da doacao ja confirmado",
        code: Status.CONFIRMADO,
      };
    }

    if (pagamento.status === Status.CANCELADO) {
      return {
        message: "Pagamento da doacao cancelado",
        code: Status.CANCELADO,
      };
    }

    const currentDate = new Date();

    if (pagamento.data_criacao > addMinutes(currentDate, 15) || pagamento.status === Status.EXPIRADO) {
      const deletePagamento = Pagamento.update(pagamento.id, { status: Status.EXPIRADO });
      const deleteDoacao = Doacao.update(doacao.id, { status: Status.EXPIRADO });

      const paymentClient = new PaymentClient(new MercadoPagoAdapter());
      const deletePayment = paymentClient.cancelPayment(pagamento.paymentId);

      await Promise.all([deletePagamento, deleteDoacao, deletePayment]);
      return {
        message: "Pagamento da doacao expirado",
        code: Status.EXPIRADO,
      };
    }

    const paymentClient = new PaymentClient(new MercadoPagoAdapter());
    const payment = (await paymentClient.getPayment(pagamento.paymentId)) as PaymentResponse;

    if (!payment) {
      throw new Error("Pagamento nao encontrado");
    }

    if (payment.status === "approved") {
      const updatePagamento = Pagamento.update(doacaoId, { status: Status.CONFIRMADO });
      const updateDoacao = Doacao.update(doacaoId, { status: Status.CONFIRMADO });

      await Promise.all([updatePagamento, updateDoacao]);

      return {
        message: "Pagamento da doacao realizado com sucesso!",
        code: "OK",
      };
    }
  }

  static async deleteDoacao(docaoId: string) {
    const { doacao, pagamento } = await this.getDoacaoAndPagamento(docaoId);

    return await prisma.$transaction(async (tx) => {
      const deleteDoacao = Doacao.delete(doacao.id);

      const paymentClient = new PaymentClient(new MercadoPagoAdapter());
      const deletePayment = paymentClient.cancelPayment(pagamento.paymentId);

      await Promise.all([deleteDoacao, deletePayment]);

      return { message: "Pagamento da doacao deletado com sucesso!", code: "OK" };
    });
  }

  static async cancelDoacao(doacaoId: string) {
    const { doacao, pagamento } = await this.getDoacaoAndPagamento(doacaoId);

    if (doacao.status !== Status.PENDENTE) {
      return {
        message: "Pagamento da doacao nao pode ser cancelado, pois a doação não está mais pendente",
        code: "NOT PENDING",
      };
    }

    const deleteDoacao = await prisma.$transaction(async (tx) => {
      const updateDoacao = Doacao.update(doacao.id, { status: Status.CANCELADO });
      const updatePagamento = Pagamento.update(pagamento.id, { status: Status.CANCELADO });

      return await Promise.all([updateDoacao, updatePagamento]);
    });

    if (!deleteDoacao) {
      throw new Error("Doacao nao encontrada");
    }
    const paymentClient = new PaymentClient(new MercadoPagoAdapter());
    const cancelPayment = await paymentClient.cancelPayment(pagamento.paymentId);

    if (!cancelPayment) {
      throw new Error("Não foi possivel cancelar o pagamento");
    }

    return { message: "Pagamento da doacao cancelado com sucesso!", code: "OK" };
  }

  static async filteredGetAll(
    filter?: "periodo" | "valor" | undefined,
    orderBy?: "valor" | "status" | "data_criacao" | "data_confirmacao" | undefined,
    start?: string | undefined,
    end?: string | undefined,
    status?: Status | undefined,
  ) {
    const where: Prisma.DoacaoWhereInput = {
      status: status || undefined,
      data_criacao:
        filter === "periodo"
          ? {
              gte: start ? new Date(start) : undefined,
              lte: end ? new Date(end) : undefined,
            }
          : undefined,
      valor:
        filter === "valor"
          ? {
              gte: start || undefined,
              lte: end || undefined,
            }
          : undefined,
    };

    const orderByParams: Prisma.DoacaoOrderByWithRelationInput = {
      [orderBy || "data_criacao"]: "desc",
    };

    return await Doacao.getAll(where, orderByParams);
  }
}
