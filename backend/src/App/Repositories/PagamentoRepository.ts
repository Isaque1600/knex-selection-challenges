import { PaymentBody } from "@/Interfaces/PaymentAdapter";
import { prisma } from "@/Lib/prisma";
import { MercadoPagoAdapter } from "@/Services/MercadoPagoAdapter";
import { PaymentClient } from "@/Services/PaymentCLient";
import { Prisma, Status } from "@prisma/client";
import { addDays, addMinutes, format } from "date-fns";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { Doacao } from "../Models/Doacao";
import { Doador } from "../Models/Doador";
import { Pagamento } from "../Models/Pagamento";

export class PagamentoRepository {
  static async getQrCode(id: string) {
    const pagamento = await Pagamento.get(id);

    return { qr_code_base64: pagamento.qr_code, qr_code: pagamento.chave_pix };
  }

  static async getStatus(id: string) {
    const pagamento = await Pagamento.get(id);

    const { status } = pagamento;

    return { status };
  }

  static async getPagamento(id: string) {
    return await Pagamento.get(id);
  }

  static async filteredGetAll(
    filter?: "criacao" | "confirmacao" | "expiracao" | undefined,
    orderBy?: "status" | "data_criacao" | "data_confirmacao" | "data_expiracao" | undefined,
    start?: string | undefined,
    end?: string | undefined,
    status?: Status | undefined,
  ) {
    const where: Prisma.PagamentoWhereInput = {
      status: status || undefined,
      data_criacao:
        filter === "criacao"
          ? {
              gte: start ? new Date(start) : undefined,
              lte: end ? new Date(end) : undefined,
            }
          : undefined,
      data_confirmacao:
        filter === "confirmacao"
          ? {
              gte: start ? new Date(start) : undefined,
              lte: end ? new Date(end) : undefined,
            }
          : undefined,
      data_expiracao:
        filter === "expiracao"
          ? {
              gte: start ? new Date(start) : undefined,
              lte: end ? new Date(end) : undefined,
            }
          : undefined,
    };

    const orderByParams: Prisma.PagamentoOrderByWithRelationInput = {
      [orderBy || "data_criacao"]: "desc",
    };

    return await Pagamento.getAll(where, orderByParams);
  }

  static async generateNewPagamento(id: string) {
    const oldPagamento = await Pagamento.get(id);

    if (!oldPagamento) {
      throw new Error("Pagamento nao encontrado");
    }

    if (oldPagamento.status !== Status.EXPIRADO) {
      throw new Error("Pagamento ainda nao expirou");
    }

    const newPagamento = await prisma.$transaction(async (tx) => {
      const doacao = await Doacao.get(oldPagamento.doacaoId);
      const doador = await Doador.get(doacao.doadorId as string);

      if (!doacao || !doador) {
        throw new Error("Doacao ou doador nao encontrado");
      }

      const currentDate = new Date();
      // Mercado pago só aceita expiração de pagamento entre 30min a 30 dias
      const expirationDate = format(addDays(currentDate, 1), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

      const body: PaymentBody = {
        date_of_expiration: expirationDate,
        transaction_amount: Number(doacao.valor),
        description: doacao.mensagem || undefined,
        notification_url: `http://localhost:3333/doacao/realizar-pagamento/${oldPagamento.id}`,
        payer: {
          email: doador.email,
        },
      };

      const idempotencyKey = `${oldPagamento.id}`;

      const paymentClient = new PaymentClient(new MercadoPagoAdapter());
      const payment = (await paymentClient.createPayment(body, idempotencyKey)) as PaymentResponse;

      if (!payment) {
        throw new Error("Nao foi possivel criar o pagamento");
      }

      const expirationDatePagamento = addMinutes(currentDate, 15);

      const updateDoacao = Doacao.update(doacao.id, {
        status: Status.PENDENTE,
      });

      const newPagamento = Pagamento.update(oldPagamento.id, {
        paymentId: payment.id!.toString(),
        chave_pix: payment.point_of_interaction?.transaction_data?.qr_code,
        qr_code: payment.point_of_interaction?.transaction_data?.qr_code_base64,
        data_expiracao: expirationDatePagamento,
        status: Status.PENDENTE,
      });

      await Promise.all([updateDoacao, newPagamento]);

      return newPagamento;
    });

    return { qr_code: newPagamento.chave_pix, qr_code_base64: newPagamento.qr_code };
  }
}
