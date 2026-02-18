import { CreateShortUrlController } from "./create.controller";
import { makeCreateShortUrlUseCase } from "@application/use-cases/shortUrl/create/index";

export const createShortUrlController = new CreateShortUrlController(
  makeCreateShortUrlUseCase(),
);
