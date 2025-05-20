import { ShortUrlRepository } from "@infrastructure/prisma/shortUrl/shortUrl.repository";
import { RedirectShortUrlUseCase } from "./redirect.usecase";
import { contabilizeAccessToUrlUseCase } from "../contabilizeAccessToUrl/index";

const shortUrlRepository = new ShortUrlRepository();
export const redirectShortUrlUseCase = new RedirectShortUrlUseCase(
  shortUrlRepository,
  contabilizeAccessToUrlUseCase
);
