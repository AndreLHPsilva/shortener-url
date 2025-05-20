import { ShortUrlInMemoryRepository } from "@infrastructure/inMemory/shortUrl/shortUrlInMemory.repository";
import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository";

export function shortUrlRepositoryFactory() {
  if (process.env.NODE_ENV === "test") {
    return new ShortUrlInMemoryRepository();
  }

  return new ShortUrlRepository();
}
