import { DeleteShortUrlController } from "./delete.controller";
import { deleteShortUrlUseCase } from "@application/use-cases/shortUrl/delete/index";

export const deleteShortUrlController = new DeleteShortUrlController(
  deleteShortUrlUseCase
);
