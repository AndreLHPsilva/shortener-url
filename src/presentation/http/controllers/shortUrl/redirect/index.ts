import { RedirectShortUrlController } from "./redirect.controller";
import { redirectShortUrlUseCase } from "@application/use-cases/shortUrl/redirect/index";

export const redirectShortUrlController = new RedirectShortUrlController(
  redirectShortUrlUseCase
);
