import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";
import { ListShortUrlUseCase } from "./list.usecase.js";

const shortUrlRepository = new ShortUrlRepository();
export const listShortUrlUseCase = new ListShortUrlUseCase(shortUrlRepository);
