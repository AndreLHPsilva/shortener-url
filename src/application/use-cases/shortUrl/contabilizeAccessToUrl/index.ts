import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";
import { ContabilizeAccessToUrlUseCase } from "./contabilizeAccessToUrl.usecase.js";
import { AccessShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/accessShortUrlLog.repository.js";

const shortUrlRepository = new ShortUrlRepository();
const accessShortUrlLogRepository = new AccessShortUrlLogRepository();
export const contabilizeAccessToUrlUseCase = new ContabilizeAccessToUrlUseCase(
  accessShortUrlLogRepository,
  shortUrlRepository
);
