import { prisma } from "@/Lib/prisma";
import { Status } from "@prisma/client";

export class Pagamento {
  static async create(
    chave_pix: string,
    qr_code: { qr_code_url: string; qr_code_base64: string },
    doacaoId: string,
    status: Status,
  ) {
    return prisma.pagamento.create({
      data: {
        chave_pix,
        qr_code,
        status,
        doacaoId,
      },
    });
  }

  static async update(
    id: string,
    chave_pix: string,
    qr_code: {
      qr_code_url: string;
      qr_code_base64: string;
    },
    status: Status,
    data_expiracao: Date,
    data_confirmacao: Date,
    doacaoId: string,
  ) {
    return prisma.pagamento.update({
      where: {
        id,
      },
      data: {
        chave_pix,
        qr_code,
        status,
        data_expiracao,
        data_confirmacao,
        Doacao: {
          connect: {
            id: doacaoId,
          },
        },
      },
    });
  }

  static async get(id: string) {
    return prisma.pagamento.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  static async getAll() {
    return prisma.pagamento.findMany();
  }

  static async delete(id: string) {
    return prisma.pagamento.delete({
      where: {
        id,
      },
    });
  }
}
