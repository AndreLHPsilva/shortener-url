import { AppError } from "./AppError";

export class ShortUrlNotFoundedError extends AppError {
  constructor() {
    super("ShortUrl not founded", 404, "SHORT_URL_NOT_FOUND");
  }
}
