import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator.js";
import { HttpResponse } from "@shared/http/HttpResponse.js";
import { CreateUserValidator } from "./types.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { ICreateUserUseCaseProps } from "@application/use-cases/user/create/types.js";

export class CreateUserController {
  constructor(
    private createUserUseCase: UseCase<ICreateUserUseCaseProps, void>
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const {confirmPassword, ...data} = ZodValidatorError.parse(
      CreateUserValidator,
      request.body
    );

    await this.createUserUseCase.execute(data);

    return HttpResponse.created(null, reply);
  }
}
