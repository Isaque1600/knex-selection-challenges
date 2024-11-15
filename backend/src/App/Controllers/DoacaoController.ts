import { CreateDoacaoBody, UpdateDoacaoBody } from "@/Interfaces/DoacaoBody";
import { Status } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { z, ZodError } from "zod";
import { DoacaoRepository } from "../Repositories/DoacaoRepository";

export class DoacaoController {
  static async create(req: Request, res: Response) {
    try {
      const doacao = CreateDoacaoBody.parse(req.body);

      const response = await DoacaoRepository.createDoacao(doacao);

      res.json(response).status(200);
      return;
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        res.status(400).json(formattedErrors);
        return;
      }

      res.json(error).status(500);
      return;
    }
  }

  static async read(req: Request, res: Response) {
    try {
      const { doacaoId } = req.params;

      if (doacaoId) {
        const response = await DoacaoRepository.getDoacao(doacaoId);

        res.json(response).status(200);
        return;
      }

      const getParams = z
        .object({
          filter: z.enum(["periodo", "valor"]).optional(),
          orderBy: z.enum(["valor", "status", "data_criacao", "data_confirmacao"]).optional(),
          start: z.string().optional(),
          end: z.string().optional(),
          status: z.nativeEnum(Status).optional(),
        })
        .parse(req.query);

      const response = await DoacaoRepository.filteredGetAll(
        getParams.filter,
        getParams.orderBy,
        getParams.start,
        getParams.end,
        getParams.status,
      );

      res.json(response).status(200);
      return;
    } catch (error) {
      res.json(error).status(500);
      return;
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { doacaoId } = req.params;
      const doacao = UpdateDoacaoBody.parse(req.body);

      console.log(doacao);

      const response = await DoacaoRepository.updateDoacao(doacaoId, doacao);

      res.json(response).status(200);
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        res.status(400).json(formattedErrors);
        return;
      }

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "Doação não encontrada" });
          return;
        }
      }

      if (error instanceof PrismaClientValidationError) {
        console.log(error);

        res.status(400).json({ message: "An error occurred" });
        return;
      }

      if (error instanceof String) {
        res.json({ message: error }).status(400);
        return;
      }

      res.json(error).status(500);
      return;
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { doacaoId } = req.params;

      const response = await DoacaoRepository.deleteDoacao(doacaoId);

      res.json(response).status(200);
      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error);

        if (error.code === "P2025") {
          res.status(404).json({ message: "Doação não encontrada" });
          return;
        }
      }

      if (error instanceof String) {
        res.json({ message: error }).status(400);
        return;
      }

      res.json(error).status(500);
      return;
    }
  }

  static async realizarPagamento(req: Request, res: Response) {
    try {
      const { doacaoId } = req.params;
      const { action } = req.body;

      if (action === "payment.updated") {
        const response = await DoacaoRepository.realizarPagamento(doacaoId);

        res.json(response).status(200);
        return;
      }

      res.json({ message: "Ação nao encontrada" }).status(404);
      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error);

        if (error.code === "P2025") {
          res.status(404).json({ message: "Doação não encontrada" });
          return;
        }
      }

      res.json(error).status(500);
      return;
    }
  }

  static async cancelDoacao(req: Request, res: Response) {
    try {
      const { doacaoId } = req.params;

      const response = await DoacaoRepository.cancelDoacao(doacaoId);

      res.json(response).status(200);
      return;
    } catch (error) {
      console.log(error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "Doação não encontrada" });
          return;
        }
      }

      res.json(error).status(500);
      return;
    }
  }
}
