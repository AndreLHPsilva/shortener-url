import { AccessShortUrlLogInMemoryRepository } from "@infrastructure/inMemory/shortUrl/accessShortUrlLogInMemory.repository";
import { ShortUrlLogInMemoryRepository } from "@infrastructure/inMemory/shortUrl/shortUrlLogInMemory.repository";
import { AccessShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/accessShortUrlLog.repository";
import { ShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/shortUrlLog.repository";

export function accessShortUrlRepositoryFactory() {
  if (process.env.NODE_ENV === "test") {
    return new AccessShortUrlLogInMemoryRepository();
  }

  return new AccessShortUrlLogRepository();
}
