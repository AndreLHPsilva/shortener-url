import { AppError } from "./AppError.js";

export class EmailOrPasswordIncorrectError extends AppError {
  constructor() {
    super("Email or password incorrect", 401, "EMAIL_OR_PASSWORD_INCORRECT");
  }
}
