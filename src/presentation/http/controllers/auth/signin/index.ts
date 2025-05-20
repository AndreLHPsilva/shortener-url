import { SigninController } from "./signin.controller";
import { signinUseCase } from "@application/use-cases/auth/signin/index";

export const signinController = new SigninController(signinUseCase);
