/*
  Warnings:

  - You are about to drop the column `pagamentoId` on the `doacoes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doacaoId]` on the table `pagamentos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doacaoId` to the `pagamentos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "doacoes" DROP CONSTRAINT "doacoes_pagamentoId_fkey";

-- AlterTable
ALTER TABLE "doacoes" DROP COLUMN "pagamentoId";

-- AlterTable
ALTER TABLE "pagamentos" ADD COLUMN     "doacaoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_doacaoId_key" ON "pagamentos"("doacaoId");

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_doacaoId_fkey" FOREIGN KEY ("doacaoId") REFERENCES "doacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
