import { createUserUseCase } from "@application/use-cases/user/create/index.js";
import { CreateUserController } from "./create.controller.js";

export const createUserController = new CreateUserController(createUserUseCase);
