import { CreateUserUseCase } from "./create.usecase.js";
import { userRepositoryFactory } from "@infrastructure/factory/userRepository.factory.js";

const userRepository = userRepositoryFactory();
export const createUserUseCase = new CreateUserUseCase(userRepository);
