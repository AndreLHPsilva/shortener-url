import { AppError } from "./AppError";

export class FailedGenerateIdentifierError extends AppError {
  constructor() {
    super("Internal server error", 400, "Err0003");
  }
}
