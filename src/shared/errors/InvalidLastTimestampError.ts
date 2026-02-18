import { AppError } from "./AppError";

export class InvalidLastTimestampError extends AppError {
  constructor() {
    super("Internal server error", 500, "PROCESS_IDENTIFY_URL_PARAMETER_INVALID_02");
  }
}
