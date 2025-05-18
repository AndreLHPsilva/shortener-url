import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository.js";
import { RedirectShortUrlUseCase } from "./redirect.usecase.js";
import { contabilizeAccessToUrlUseCase } from "../contabilizeAccessToUrl/index.js";

const shortUrlRepository = new ShortUrlRepository();
export const redirectShortUrlUseCase = new RedirectShortUrlUseCase(
  shortUrlRepository,
  contabilizeAccessToUrlUseCase
);
