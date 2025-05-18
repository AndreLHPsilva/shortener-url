/*
  Warnings:

  - Added the required column `action` to the `short_url_logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "shortener"."ActionShortUrlLogs" AS ENUM ('DELETE', 'UPDATE');

-- AlterTable
ALTER TABLE "shortener"."short_url_logs" ADD COLUMN     "action" "shortener"."ActionShortUrlLogs" NOT NULL;
