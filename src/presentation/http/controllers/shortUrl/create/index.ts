import { CreateShortUrlController } from "./create.controller.js";
import { createShortUrlUseCase } from "@application/use-cases/shortUrl/create/index.js";

export const createShortUrlController = new CreateShortUrlController(
  createShortUrlUseCase
);
