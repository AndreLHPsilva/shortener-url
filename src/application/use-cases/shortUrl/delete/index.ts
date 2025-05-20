import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository";
import { CreateLogWhenUpdateUseCase } from "../createLogWhenUpdate/createLogWhenUpdate.usecase";
import { ShortUrlLogRepository } from "@infrastructure/prisma/shortUrl/shortUrlLog.repository";
import { DeleteShortUrlUseCase } from "./delete.usecase";

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
