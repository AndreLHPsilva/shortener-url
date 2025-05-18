-- CreateTable
CREATE TABLE "shortener"."access_short_url_logs" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "accessedOn" TEXT NOT NULL,
    "shortUrlId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_short_url_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shortener"."access_short_url_logs" ADD CONSTRAINT "access_short_url_logs_shortUrlId_fkey" FOREIGN KEY ("shortUrlId") REFERENCES "shortener"."short_urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
