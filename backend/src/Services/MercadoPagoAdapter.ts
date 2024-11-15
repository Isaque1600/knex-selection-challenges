import { PaymentAdapter, PaymentBody, PaymentRequestOptions } from "@/Interfaces/PaymentAdapter";
import { payment } from "@/Lib/mercadopago";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export class MercadoPagoAdapter implements PaymentAdapter {
  payment = payment;

  async createPayment(
    { transaction_amount, date_of_expiration, payer, description }: PaymentBody,
    idempotencyKey: string,
  ): Promise<PaymentResponse> {
    const body: PaymentBody = {
      transaction_amount,
      date_of_expiration,
      description: description || "Doação para os cães",
      payer,
    };

    const requestOptions = { idempotencyKey };

    return await this.pix(body, requestOptions);
  }

  async pix(body: PaymentBody, requestOptions: PaymentRequestOptions): Promise<PaymentResponse> {
    body.payment_method_id = "pix";

    const payment = await this.payment.create({ body, requestOptions });

    return payment;
  }

  async getPayment(id: string): Promise<PaymentResponse> {
    return await this.payment.get({ id, requestOptions: { timeout: 5000, idempotencyKey: `${id}-${Date.now()}` } });
  }

  async cancelPayment(id: string): Promise<PaymentResponse> {
    return await this.payment.cancel({ id, requestOptions: { timeout: 5000, idempotencyKey: `${id}-${Date.now()}` } });
  }
}
