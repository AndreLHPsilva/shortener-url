import { UserRepository } from "@infrastructure/prisma/user/user.repository.js";
import { SigninUseCase } from "./signin.usecase.js";

const userRepository = new UserRepository();
export const signinUseCase = new SigninUseCase(userRepository);
