import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository";
import { ContabilizeAccessToUrlUseCase } from "./contabilizeAccessToUrl.usecase";
import { AccessShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/accessShortUrlLog.repository";

const shortUrlRepository = new ShortUrlRepository();
const accessShortUrlLogRepository = new AccessShortUrlLogRepository();
export const contabilizeAccessToUrlUseCase = new ContabilizeAccessToUrlUseCase(
  accessShortUrlLogRepository,
  shortUrlRepository
);
