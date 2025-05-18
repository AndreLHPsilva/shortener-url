import { AppError } from "./AppError.js";

export class UserNotFoundedError extends AppError {
  constructor() {
    super("User not founded", 404, "USER_NOT_FOUND");
  }
}
