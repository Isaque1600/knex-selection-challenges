import { prisma } from "@/Lib/prisma";
import { Prisma, Status } from "@prisma/client";

type DoacaoType = {
  valor: number;
  mensagem?: string;
  doadorId: string;
  status?: Status;
};

export class Doacao {
  static async create(
    { valor, mensagem, doadorId, status = Status.PENDENTE }: DoacaoType,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;

    return await client.doacao.create({
      data: {
        valor,
        mensagem,
        status,
        data_confirmacao: null,
        Doador: {
          connect: {
            id: doadorId,
          },
        },
      },
    });
  }

  static async update(
    id: string,
    { valor, mensagem, status, doadorId }: { valor?: number; mensagem?: string; status?: Status; doadorId?: string },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;

    return await client.doacao.update({
      where: {
        id,
      },
      data: {
        valor,
        mensagem,
        status,
        Doador: { connect: { id: doadorId } },
      },
    });
  }

  static async get(id: string) {
    return prisma.doacao.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  static async getAll(where?: Prisma.DoacaoWhereInput, orderBy?: Prisma.DoacaoOrderByWithRelationInput) {
    return prisma.doacao.findMany({
      where,
      orderBy,
    });
  }

  static async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || prisma;

    return client.doacao.delete({
      where: {
        id,
      },
    });
  }
}
