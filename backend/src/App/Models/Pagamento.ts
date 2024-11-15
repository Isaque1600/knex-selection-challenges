import { prisma } from "@/Lib/prisma";
import { Prisma, Status } from "@prisma/client";

export class Pagamento {
  static async create(
    {
      paymentId,
      chave_pix,
      qr_code,
      doacaoId,
      status,
      data_criacao,
      data_expiracao,
      data_confirmacao,
    }: {
      paymentId: string;
      chave_pix: string;
      qr_code: string;
      doacaoId: string;
      status: Status;
      data_criacao?: string;
      data_expiracao: Date;
      data_confirmacao?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;

    return await client.pagamento.create({
      data: {
        paymentId,
        chave_pix,
        qr_code,
        status,
        data_criacao,
        data_expiracao,
        data_confirmacao,
        doacaoId,
      },
    });
  }

  static async update(
    id: string,
    {
      paymentId,
      chave_pix,
      qr_code,
      status,
      data_expiracao,
      data_confirmacao,
      doacaoId,
    }: {
      paymentId?: string;
      chave_pix?: string;
      qr_code?: string;
      status?: Status;
      data_expiracao?: Date;
      data_confirmacao?: Date;
      doacaoId?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;

    return await client.pagamento.update({
      where: {
        id,
      },
      data: {
        paymentId,
        chave_pix,
        qr_code,
        status,
        data_expiracao,
        data_confirmacao,
        doacaoId,
      },
    });
  }

  static async get(id: string) {
    return await prisma.pagamento.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  static async getByDoacaoId(doacaoId: string) {
    return await prisma.pagamento.findUniqueOrThrow({
      where: {
        doacaoId,
      },
    });
  }

  static async getAll(where?: Prisma.PagamentoWhereInput, orderBy?: Prisma.PagamentoOrderByWithRelationInput) {
    return await prisma.pagamento.findMany({
      where,
      orderBy,
    });
  }

  static async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || prisma;

    return await client.pagamento.delete({
      where: {
        id,
      },
    });
  }
}
