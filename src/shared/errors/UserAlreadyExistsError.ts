import { AppError } from "./AppError.js";

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super("User already exists", 400, "USER_ALREADY_EXISTS");
  }
}
