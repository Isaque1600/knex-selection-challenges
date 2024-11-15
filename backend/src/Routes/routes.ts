import { Router } from "express";
import { DoacaoRoutes } from "./DoacaoRoutes";
import { DoadorRoutes } from "./DoadorRoutes";

export const router = Router();

router.use("/doador", DoadorRoutes);
router.use("/doacao", DoacaoRoutes);
