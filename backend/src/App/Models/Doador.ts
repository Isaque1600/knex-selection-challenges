import { prisma } from "@/Lib/prisma";
import { Prisma } from "@prisma/client";

export class Doador {
  static async create(
    { nome, email, telefone }: { nome: string; email: string; telefone: string },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;

    return await client.doador.create({
      data: {
        nome,
        email,
        telefone,
      },
    });
  }

  static async update(
    id: string,
    { nome, email, telefone }: { nome?: string; email?: string; telefone?: string },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;

    return await client.doador.update({
      where: {
        id,
      },
      data: {
        nome,
        email,
        telefone,
      },
    });
  }

  static async get(id: string) {
    return await prisma.doador.findUnique({
      where: {
        id,
      },
    });
  }

  static async getAll() {
    return await prisma.doador.findMany();
  }

  static async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || prisma;

    return await client.doador.delete({
      where: {
        id,
      },
    });
  }

  static async getDoacoes(id: string) {
    return await prisma.doador.findUnique({
      where: {
        id,
      },
      select: {
        Doacao: true,
      },
    });
  }
}
