/*
  Warnings:

  - Made the column `path` on table `short_urls` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "shortener"."short_urls" ALTER COLUMN "path" SET NOT NULL,
ALTER COLUMN "path" SET DEFAULT '/';
