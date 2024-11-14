import { CreateDoadorBody, UpdateDoadorBody } from "@/Interfaces/DoadorBody";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { Doador } from "../Models/Doador";

export class DoadorController {
  static async create(req: Request, res: Response) {
    try {
      const doador = CreateDoadorBody.parse(req.body);

      const response = await Doador.create(doador);

      res.json(response).status(201);
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
        if (error.code === "P2002") {
          const errorField = error.meta?.target || "doador";

          res.status(400).json({ message: `${errorField} já cadastrado` });
          return;
        }
      }

      res.json(error).status(500);
      return;
    }
  }

  static async read(req: Request, res: Response) {
    try {
      const { doadorId } = req.params;

      if (doadorId) {
        const response = await Doador.get(doadorId);

        res.json(response).status(200);
        return;
      }

      const response = await Doador.getAll();

      res.json(response).status(200);
      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "Doador não encontrado" });
          return;
        }
      }

      res.json(error).status(500);
      return;
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { doadorId } = req.params;
      const { ...doador } = req.body;

      const doadorParsed = UpdateDoadorBody.parse(doador);

      const response = await Doador.update(doadorId, doadorParsed);

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
        if (error.code === "P2002") {
          const errorField = error.meta?.target || "doador";

          res.status(400).json({ message: `${errorField} já cadastrado` });
          return;
        }
        if (error.code === "P2025") {
          res.status(404).json({ message: "Doador não encontrado" });
          return;
        }
      }

      res.json(error).status(500);
      return;
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { doadorId } = req.params;

      const response = await Doador.delete(doadorId);

      res.json({ message: "Doador deletado com sucesso!", doador: response }).status(200);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "Doador não encontrado" });
          return;
        }
      }

      res.json(error).status(500);
      return;
    }
  }
}
