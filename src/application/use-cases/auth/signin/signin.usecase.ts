import { ISigninResponseUseCase, ISigninUseCaseProps } from "./types";
import { UseCase } from "@application/use-cases/contract/useCase";
import { compare } from "bcryptjs";
import { EmailOrPasswordIncorrectError } from "@shared/errors/EmailOrPasswordIncorrectError";
import { IUserRepository } from "@domain/interfaces/userRepository.interface";
import { app } from "src/app";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

export class SigninUseCase extends UseCase<
  ISigninUseCaseProps,
  ISigninResponseUseCase
> {
  constructor(private repository: IUserRepository) {
    super();
  }

  async execute({
    email,
    password,
  }: ISigninUseCaseProps): Promise<ISigninResponseUseCase> {
    const verifyUserExists = await this.repository.findByEmail(email);

    if (!verifyUserExists) {
      throw new EmailOrPasswordIncorrectError();
    }

    const passwordIsSame = await compare(
      password,
      verifyUserExists.getProps().password
    );

    if (!passwordIsSame) {
      throw new EmailOrPasswordIncorrectError();
    }

    const token = app.jwt.sign({
      id: verifyUserExists.getProps().id,
      email: verifyUserExists.getProps().email,
    });

    const response = {
      token,
    };

    setAttributeActiveSpan(ETelemetrySpanNames.RESPONSE_USE_CASE, response);

    return response;
  }
}
