-- CreateTable
CREATE TABLE "shortener"."short_urls" (
    "id" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "redirectTo" TEXT NOT NULL,
    "expiresIn" TEXT,
    "deletedAt" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "short_urls_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shortener"."short_urls" ADD CONSTRAINT "short_urls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shortener"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
