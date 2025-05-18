import { updateShortUrlUseCase } from "@application/use-cases/shortUrl/update/index.js";
import { UpdateShortUrlController } from "./update.controller.js";

export const updateShortUrlController = new UpdateShortUrlController(
  updateShortUrlUseCase
);
