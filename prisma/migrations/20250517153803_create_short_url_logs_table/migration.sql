-- CreateTable
CREATE TABLE "shortener"."short_url_logs" (
    "id" TEXT NOT NULL,
    "shortUrlId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "short_url_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shortener"."short_url_logs" ADD CONSTRAINT "short_url_logs_shortUrlId_fkey" FOREIGN KEY ("shortUrlId") REFERENCES "shortener"."short_urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shortener"."short_url_logs" ADD CONSTRAINT "short_url_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shortener"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
