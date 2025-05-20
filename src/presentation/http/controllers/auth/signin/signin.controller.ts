import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator";
import { HttpResponse } from "@shared/http/HttpResponse";
import { SigninValidator } from "./types";
import { UseCase } from "@application/use-cases/contract/useCase";
import {
  ISigninResponseUseCase,
  ISigninUseCaseProps,
} from "@application/use-cases/auth/signin/types";

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
