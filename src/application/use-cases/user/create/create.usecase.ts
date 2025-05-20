import { ICreateUserUseCaseProps } from "./types.js";
import { User } from "@domain/entities/user.entity.js";
import { UserAlreadyExistsError } from "@shared/errors/UserAlreadyExistsError.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { hash } from "bcryptjs";
import { IUserRepository } from "@infrastructure/prisma/user/contract/userRepository.interface.js";

export class CreateUserUseCase extends UseCase<ICreateUserUseCaseProps, void> {
  constructor(private repository: IUserRepository) {
    super();
  }

  async execute(data: ICreateUserUseCaseProps) {
    const verifyAlreadyExists = await this.repository.findByEmail(data.email);

    if (verifyAlreadyExists) {
      throw new UserAlreadyExistsError();
    }

    const passordHashed = await hash(data.password, 10);

    await this.repository.create(
      User.create(null, data.name, data.email, passordHashed)
    );

    return;
  }
}
