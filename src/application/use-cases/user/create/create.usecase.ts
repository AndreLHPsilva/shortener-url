import { ICreateUserUseCaseProps } from "./types";
import { User } from "@domain/entities/user.entity";
import { UserAlreadyExistsError } from "@shared/errors/UserAlreadyExistsError";
import { UseCase } from "@application/use-cases/contract/useCase";
import { hash } from "bcryptjs";
import { IUserRepository } from "@domain/interfaces/userRepository.interface";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

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

    setAttributeActiveSpan(ETelemetrySpanNames.PAYLOAD_USE_CASE, {
      name: data.name,
      email: data.email,
    });

    return;
  }
}
