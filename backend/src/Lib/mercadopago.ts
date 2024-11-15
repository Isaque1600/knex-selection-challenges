import MercadoPagoConfig, { Payment } from "mercadopago";
import { mercadoPagoAPIKEY } from "./envVariables";

export const client = new MercadoPagoConfig({
  accessToken: mercadoPagoAPIKEY,
  options: { timeout: 5000 },
});

export const payment = new Payment(client);
