import { AppError } from "./AppError";

export class ShortUrlAlreadyDeletedError extends AppError {
  constructor() {
    super("Short url already deleted", 400, "SHORT_URL_ALREADY_DELETED");
  }
}
