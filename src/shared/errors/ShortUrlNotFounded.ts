import { AppError } from "./AppError.js";

export class ShortUrlNotFoundedError extends AppError {
  constructor() {
    super("ShortUrl not founded", 404, "SHORT_URL_NOT_FOUND");
  }
}
