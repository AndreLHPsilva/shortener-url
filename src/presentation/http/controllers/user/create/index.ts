import { createUserUseCase } from "@application/use-cases/user/create/index";
import { CreateUserController } from "./create.controller";

export const createUserController = new CreateUserController(createUserUseCase);
