import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository";
import { ListShortUrlUseCase } from "./list.usecase";

const shortUrlRepository = new ShortUrlRepository();
export const listShortUrlUseCase = new ListShortUrlUseCase(shortUrlRepository);
