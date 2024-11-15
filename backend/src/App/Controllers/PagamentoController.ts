import { Status } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { z } from "zod";
import { PagamentoRepository } from "../Repositories/PagamentoRepository";

export class PagamentoController {
  static async read(req: Request, res: Response) {
    try {
      const { pagamentoId } = req.params;

      if (pagamentoId) {
        const response = await PagamentoRepository.getPagamento(pagamentoId);

        res.json(response).status(200);
        return;
      }

      const getParams = z
        .object({
          filter: z.enum(["criacao", "confirmacao", "expiracao"]).optional(),
          orderBy: z.enum(["status", "data_criacao", "data_confirmacao", "data_expiracao"]).optional(),
          start: z.string().optional(),
          end: z.string().optional(),
          status: z.nativeEnum(Status).optional(),
        })
        .parse(req.query);

      const response = await PagamentoRepository.filteredGetAll(
        getParams.filter,
        getParams.orderBy,
        getParams.start,
        getParams.end,
        getParams.status,
      );

      res.json(response).status(200);
      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "Pagamento nao encontrado" });
          return;
        }
      }

      res.json(error).status(500);
      return;
    }
  }

  static async getQrCode(req: Request, res: Response) {
    try {
      const { pagamentoId } = req.params;

      const response = await PagamentoRepository.getQrCode(pagamentoId);

      res.json(response).status(200);
      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "Pagamento nao encontrado" });
          return;
        }
      }

      res.json(error).status(500);
      return;
    }
  }

  static async getStatus(req: Request, res: Response) {
    try {
      const { pagamentoId } = req.params;

      const response = await PagamentoRepository.getStatus(pagamentoId);

      res.json(response).status(200);
      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "Pagamento nao encontrado" });
          return;
        }
      }

      res.json(error).status(500);
      return;
    }
  }

  static async regeneratePagamento(req: Request, res: Response) {
    try {
      const { pagamentoId } = req.params;

      const response = await PagamentoRepository.generateNewPagamento(pagamentoId);

      res.json(response).status(200);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.json({ message: error.message }).status(400);
        return;
      }

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "Pagamento nao encontrado" });
          return;
        }
      }

      res.json(error).status(500);
      return;
    }
  }
}
