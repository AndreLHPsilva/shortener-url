/*
  Warnings:

  - You are about to drop the column `redirectTo` on the `short_urls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier]` on the table `short_urls` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `short_urls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shortener"."short_urls" DROP COLUMN "redirectTo",
ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "short_urls_identifier_key" ON "shortener"."short_urls"("identifier");

-- CreateIndex
CREATE INDEX "short_urls_id_identifier_idx" ON "shortener"."short_urls"("id", "identifier");
