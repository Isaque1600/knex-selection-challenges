import express from "express";
import { router } from "./Routes/routes";

export const app = express();

app.use(express.json());

app.use(router);
