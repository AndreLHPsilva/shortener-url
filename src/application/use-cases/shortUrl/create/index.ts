import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";
import { CreateShortUrlUseCase } from "./create.usecase.js";

const shortUrlRepository = new ShortUrlRepository();
export const createShortUrlUseCase = new CreateShortUrlUseCase(shortUrlRepository);
