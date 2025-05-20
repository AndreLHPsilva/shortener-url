import { AppError } from "./AppError";

export class ShortUrlExpired extends AppError {
  constructor() {
    super("ShortUrl expired", 410, "SHORT_URL_EXPIRED");
  }
}
