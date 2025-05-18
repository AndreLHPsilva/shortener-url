/*
  Warnings:

  - The `expiresIn` column on the `short_urls` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "shortener"."short_urls" DROP COLUMN "expiresIn",
ADD COLUMN     "expiresIn" TIMESTAMP(3);
