import { updateShortUrlUseCase } from "@application/use-cases/shortUrl/update/index";
import { UpdateShortUrlController } from "./update.controller";

export const updateShortUrlController = new UpdateShortUrlController(
  updateShortUrlUseCase
);
