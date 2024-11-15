export type PaymentBody = {
  transaction_amount: number;
  description?: string;
  payment_method_id?: string;
  date_of_expiration: string;
  notification_url?: string;
  payer: {
    email: string;
  };
};

export type PaymentRequestOptions = {
  idempotencyKey: string;
};

export interface PaymentAdapter {
  createPayment(body: PaymentBody, idempotencyKey: string): Promise<unknown>;
  pix(body: PaymentBody, requestOptions: PaymentRequestOptions): Promise<unknown>;
  getPayment(id: string): Promise<unknown>;
  cancelPayment(id: string): Promise<unknown>;
}
