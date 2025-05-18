import { SigninController } from "./signin.controller.js";
import { signinUseCase } from "@application/use-cases/auth/signin/index.js";

export const signinController = new SigninController(signinUseCase);
