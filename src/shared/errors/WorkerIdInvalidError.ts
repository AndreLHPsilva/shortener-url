import { AppError } from "./AppError";

export class WorkerIdInvalidError extends AppError {
  constructor() {
    super("Internal server error", 500, "PROCESS_IDENTIFY_URL_PARAMETER_INVALID_01");
  }
}
