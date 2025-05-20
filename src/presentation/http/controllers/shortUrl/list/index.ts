import { ListShortUrlController } from "./list.controller";
import { listShortUrlUseCase } from "@application/use-cases/shortUrl/list/index";

export const listShortUrlController = new ListShortUrlController(
  listShortUrlUseCase
);
