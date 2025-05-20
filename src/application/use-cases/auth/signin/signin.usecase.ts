import { ISigninResponseUseCase, ISigninUseCaseProps } from "./types.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { compare } from "bcryptjs";
import { EmailOrPasswordIncorrectError } from "@shared/errors/EmailOrPasswordIncorrectError.js";
import { IUserRepository } from "@infrastructure/prisma/user/contract/userRepository.interface.js";
import { app } from "src/app.js";

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

    return {
      token,
    };
  }
}
