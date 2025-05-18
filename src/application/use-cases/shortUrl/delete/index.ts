import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";
import { CreateLogWhenUpdateUseCase } from "../createLogWhenUpdate/createLogWhenUpdate.usecase.js";
import { ShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/shortUrlLog.repository.js";
import { DeleteShortUrlUseCase } from "./delete.usecase.js";

const shortUrlRepository = new ShortUrlRepository();
const shortUrlLogsRepository = new ShortUrlLogRepository();
const createLogWhenUpdateUseCase = new CreateLogWhenUpdateUseCase(
  shortUrlLogsRepository,
  shortUrlRepository
);
export const deleteShortUrlUseCase = new DeleteShortUrlUseCase(
  shortUrlRepository,
  createLogWhenUpdateUseCase
);
