import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";
import { UpdateShortUrlUseCase } from "./update.usecase.js";

const shortUrlRepository = new ShortUrlRepository();
export const updateShortUrlUseCase = new UpdateShortUrlUseCase(
  shortUrlRepository
);
