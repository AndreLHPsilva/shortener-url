import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository";
import { UpdateShortUrlUseCase } from "./update.usecase";
import { CreateLogWhenUpdateUseCase } from "../createLogWhenUpdate/createLogWhenUpdate.usecase";
import { ShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/shortUrlLog.repository";

const shortUrlRepository = new ShortUrlRepository();
const shortUrlLogsRepository = new ShortUrlLogRepository();
const createLogWhenUpdateUseCase = new CreateLogWhenUpdateUseCase(
  shortUrlLogsRepository,
  shortUrlRepository
);
export const updateShortUrlUseCase = new UpdateShortUrlUseCase(
  shortUrlRepository,
  createLogWhenUpdateUseCase
);
