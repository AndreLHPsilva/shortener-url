import { ShortUrlLogInMemoryRepository } from "@infrastructure/inMemory/shortUrl/shortUrlLogInMemory.repository.js";
import { ShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/shortUrlLog.repository.js";

export function shortUrlLogRepositoryFactory() {
  if (process.env.NODE_ENV === "test") {
    return new ShortUrlLogInMemoryRepository();
  }

  return new ShortUrlLogRepository();
}
