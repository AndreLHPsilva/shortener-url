import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator.js";
import { HttpResponse } from "@shared/http/HttpResponse.js";
import { SigninValidator } from "./types.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import {
  ISigninResponseUseCase,
  ISigninUseCaseProps,
} from "@application/use-cases/auth/signin/types.js";

export class SigninController {
  constructor(
    private signInUseCase: UseCase<ISigninUseCaseProps, ISigninResponseUseCase>
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const dataValidated = ZodValidatorError.parse(
      SigninValidator,
      request.body
    );

    const data = await this.signInUseCase.execute(dataValidated);

    return HttpResponse.success(data, reply);
  }
}
