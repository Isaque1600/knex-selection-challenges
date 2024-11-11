-- CreateTable
CREATE TABLE "doacoes" (
    "id" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "mensagem" TEXT,
    "status" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_confirmacao" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "pagamentoId" TEXT,
    "doadorId" TEXT,

    CONSTRAINT "doacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doacoes" ADD CONSTRAINT "doacoes_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "pagamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacoes" ADD CONSTRAINT "doacoes_doadorId_fkey" FOREIGN KEY ("doadorId") REFERENCES "doadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
