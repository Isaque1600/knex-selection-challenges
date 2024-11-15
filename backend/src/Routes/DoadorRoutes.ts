import { DoadorController } from "@/App/Controllers/DoadorController";
import { Router } from "express";

export const DoadorRoutes = Router();

DoadorRoutes.post("/", DoadorController.create);
DoadorRoutes.get("/:doadorId?", DoadorController.read);
DoadorRoutes.put("/:doadorId", DoadorController.update);
DoadorRoutes.delete("/:doadorId", DoadorController.delete);
DoadorRoutes.get("/:doadorId/doacoes", DoadorController.getDoacoes);
