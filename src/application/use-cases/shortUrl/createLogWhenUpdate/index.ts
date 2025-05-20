import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository";
import { CreateLogWhenUpdateUseCase } from "./createLogWhenUpdate.usecase";
import { ShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/shortUrlLog.repository";

const shortUrlRepository = new ShortUrlRepository();
const shortUrlLogRepository = new ShortUrlLogRepository();
export const createLogWhenUpdateUseCase = new CreateLogWhenUpdateUseCase(
  shortUrlLogRepository,
  shortUrlRepository
);
