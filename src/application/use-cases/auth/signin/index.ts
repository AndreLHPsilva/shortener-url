import { SigninUseCase } from "./signin.usecase";
import { userRepositoryFactory } from "@infrastructure/factory/userRepository.factory";

const userRepository = userRepositoryFactory();
export const signinUseCase = new SigninUseCase(userRepository);
