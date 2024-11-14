import { prisma } from "@/Lib/prisma";

export class Doador {
  static async create(nome: string, email: string, telefone: string) {
    return await prisma.doador.create({
      data: {
        nome,
        email,
        telefone,
      },
    });
  }

  static async update(id: string, nome: string, email: string, telefone: string) {
    return await prisma.doador.update({
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

  static async delete(id: string) {
    return await prisma.doador.delete({
      where: {
        id,
      },
    });
  }
}
