import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";
import { UpdateShortUrlUseCase } from "./update.usecase.js";
import { CreateLogWhenUpdateUseCase } from "../createLogWhenUpdate/createLogWhenUpdate.usecase.js";
import { ShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/shortUrlLog.repository.js";

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
