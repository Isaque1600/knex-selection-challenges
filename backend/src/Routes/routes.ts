import { Router } from "express";
import { DoadorRoutes } from "./DoadorRoutes";

export const router = Router();

router.use("/doador", DoadorRoutes);
