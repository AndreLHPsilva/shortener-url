import { AppError } from "./AppError";

export class InvalidUrlError extends AppError {
  constructor() {
    super("Provided is invalid Url", 422, "PROVIDED_INVALID_URL");
  }
}
