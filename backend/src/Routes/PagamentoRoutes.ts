import { PagamentoController } from "@/App/Controllers/PagamentoController";
import { Router } from "express";

export const PagamentoRoutes = Router();

PagamentoRoutes.get("/:pagamentoId?", PagamentoController.read);
PagamentoRoutes.get("/status/:pagamentoId", PagamentoController.getStatus);
PagamentoRoutes.get("/qr-code/:pagamentoId", PagamentoController.getQrCode);
PagamentoRoutes.post("/regenerate/:pagamentoId", PagamentoController.regeneratePagamento);
