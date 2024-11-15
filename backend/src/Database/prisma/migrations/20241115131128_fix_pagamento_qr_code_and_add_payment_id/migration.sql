/*
  Warnings:

  - The `status` column on the `doacoes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `paymentId` to the `pagamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doacoes" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDENTE',
ALTER COLUMN "data_confirmacao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pagamentos" ADD COLUMN     "paymentId" TEXT NOT NULL,
ALTER COLUMN "qr_code" SET DATA TYPE TEXT,
ALTER COLUMN "data_expiracao" DROP NOT NULL,
ALTER COLUMN "data_confirmacao" DROP NOT NULL;
