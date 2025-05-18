/*
  Warnings:

  - Added the required column `protocol` to the `short_urls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shortener"."short_urls" ADD COLUMN     "protocol" TEXT NOT NULL;
