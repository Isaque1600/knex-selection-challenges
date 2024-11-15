import { config } from "dotenv";

config();

export const chave_pix = process.env.CHAVE_PIX;
export const mercadoPagoAPIKEY = process.env.MERCADOPAGO_APIKEY;
export const API_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`;
