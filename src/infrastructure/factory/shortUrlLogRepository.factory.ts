import { ShortUrlLogInMemoryRepository } from "@infrastructure/inMemory/shortUrl/shortUrlLogInMemory.repository";
import { ShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/shortUrlLog.repository";

export function shortUrlLogRepositoryFactory() {
  if (process.env.NODE_ENV === "test") {
    return new ShortUrlLogInMemoryRepository();
  }

  return new ShortUrlLogRepository();
}
