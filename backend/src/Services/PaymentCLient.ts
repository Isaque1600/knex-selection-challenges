import { PaymentAdapter, PaymentBody } from "@/Interfaces/PaymentAdapter";

export class PaymentClient {
  paymentClient: PaymentAdapter;

  constructor(PaymentClient: PaymentAdapter) {
    this.paymentClient = PaymentClient;
  }

  async createPayment(body: PaymentBody, idempotencyKey: string): Promise<unknown> {
    return await this.paymentClient.createPayment(body, idempotencyKey);
  }

  async getPayment(id: string): Promise<unknown> {
    return await this.paymentClient.getPayment(id);
  }

  async cancelPayment(id: string): Promise<unknown> {
    return await this.paymentClient.cancelPayment(id);
  }
}
