import { ShortUrlInMemoryRepository } from "@infrastructure/inMemory/shortUrl/shortUrlInMemory.repository.js";
import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";

export function shortUrlRepositoryFactory() {
  if (process.env.NODE_ENV === "test") {
    return new ShortUrlInMemoryRepository();
  }

  return new ShortUrlRepository();
}
