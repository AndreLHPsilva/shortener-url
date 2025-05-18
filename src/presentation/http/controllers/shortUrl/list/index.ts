import { ListShortUrlController } from "./list.controller.js";
import { listShortUrlUseCase } from "@application/use-cases/shortUrl/list/index.js";

export const listShortUrlController = new ListShortUrlController(
  listShortUrlUseCase
);
