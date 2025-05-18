/*
  Warnings:

  - You are about to drop the column `accessedOn` on the `access_short_url_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shortener"."access_short_url_logs" DROP COLUMN "accessedOn";
