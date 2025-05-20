import { CreateShortUrlController } from "./create.controller";
import { createShortUrlUseCase } from "@application/use-cases/shortUrl/create/index";

export const createShortUrlController = new CreateShortUrlController(
  createShortUrlUseCase
);
