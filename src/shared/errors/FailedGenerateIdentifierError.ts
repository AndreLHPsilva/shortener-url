import { AppError } from "./AppError";
import { INTERNAL_ERRORS_CODE } from "./errors";

export class FailedGenerateIdentifierError extends AppError {
  constructor() {
    super(
      "Internal server error",
      400,
      INTERNAL_ERRORS_CODE.FAILED_GENERATE_IDENTIFIER
    );
  }
}
