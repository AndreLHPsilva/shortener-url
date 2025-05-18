import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";
import { CreateLogWhenUpdateUseCase } from "./createLogWhenUpdate.usecase.js";
import { ShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/shortUrlLog.repository.js";

const shortUrlRepository = new ShortUrlRepository();
const shortUrlLogRepository = new ShortUrlLogRepository();
export const createLogWhenUpdateUseCase = new CreateLogWhenUpdateUseCase(
  shortUrlLogRepository,
  shortUrlRepository
);
