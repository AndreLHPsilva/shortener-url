import { UserRepository } from "@infrastructure/prisma/user/user.repository.js";
import { CreateUserUseCase } from "./create.usecase.js";

const userRepository = new UserRepository();
export const createUserUseCase = new CreateUserUseCase(userRepository);
