import { RedirectShortUrlController } from "./redirect.controller.js";
import { redirectShortUrlUseCase } from "@application/use-cases/shortUrl/redirect/index.js";

export const redirectShortUrlController = new RedirectShortUrlController(
  redirectShortUrlUseCase
);
