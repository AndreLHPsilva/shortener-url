/*
  Warnings:

  - Added the required column `newValue` to the `short_url_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldValue` to the `short_url_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shortener"."short_url_logs" ADD COLUMN     "newValue" TEXT NOT NULL,
ADD COLUMN     "oldValue" TEXT NOT NULL;
