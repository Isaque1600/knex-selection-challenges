import { DoacaoController } from "@/App/Controllers/DoacaoController";
import express from "express";

export const DoacaoRoutes = express.Router();

DoacaoRoutes.post("/", DoacaoController.create);
DoacaoRoutes.get("/", DoacaoController.read);
DoacaoRoutes.get("/:doacaoId", DoacaoController.read);
DoacaoRoutes.put("/:doacaoId", DoacaoController.update);
DoacaoRoutes.delete("/:doacaoId", DoacaoController.delete);
DoacaoRoutes.post("/realizar-pagamento/:doacaoId", DoacaoController.realizarPagamento);
