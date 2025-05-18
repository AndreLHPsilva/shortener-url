import { DeleteShortUrlController } from "./delete.controller.js";
import { deleteShortUrlUseCase } from "@application/use-cases/shortUrl/delete/index.js";

export const deleteShortUrlController = new DeleteShortUrlController(
  deleteShortUrlUseCase
);
