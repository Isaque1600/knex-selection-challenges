import { prisma } from "@/Lib/prisma";
import { Status } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type DoacaoType = {
  valor: Decimal;
  mensagem?: string;
  doadorId: string;
  status?: Status;
};

export class Doacao {
  static async create({ valor, mensagem, doadorId, status = Status.PENDENTE }: DoacaoType) {
    return await prisma.doacao.create({
      data: {
        valor,
        mensagem,
        status,
        data_confirmacao: null,
        doadorId,
      },
    });
  }

  static async update(
    id: string,
    valor?: Decimal,
    mensagem?: string,
    status?: Status,
    data_confirmacao?: Date,
    doadorId?: string,
  ) {
    return prisma.doacao.update({
      where: {
        id,
      },
      data: {
        valor,
        mensagem,
        status,
        data_confirmacao,
        Doador: {
          connect: {
            id: doadorId,
          },
        },
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

  static async getAll() {
    return prisma.doacao.findMany();
  }

  static async delete(id: string) {
    return prisma.doacao.delete({
      where: {
        id,
      },
    });
  }
}
