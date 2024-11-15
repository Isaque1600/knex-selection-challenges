import { Router } from "express";
import { DoacaoRoutes } from "./DoacaoRoutes";
import { DoadorRoutes } from "./DoadorRoutes";
import { PagamentoRoutes } from "./PagamentoRoutes";

export const router = Router();

router.use("/doador", DoadorRoutes);
router.use("/doacao", DoacaoRoutes);
router.use("/pagamento", PagamentoRoutes);
