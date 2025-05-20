import { CreateUserUseCase } from "./create.usecase";
import { userRepositoryFactory } from "@infrastructure/factory/userRepository.factory";

const userRepository = userRepositoryFactory();
export const createUserUseCase = new CreateUserUseCase(userRepository);
