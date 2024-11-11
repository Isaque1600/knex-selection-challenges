-- CreateTable
CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "chave_pix" TEXT NOT NULL,
    "qr_code" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_expiracao" TIMESTAMP(3) NOT NULL,
    "data_confirmacao" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);
