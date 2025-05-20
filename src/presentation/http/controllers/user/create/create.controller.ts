import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator";
import { HttpResponse } from "@shared/http/HttpResponse";
import { CreateUserValidator } from "./types";
import { UseCase } from "@application/use-cases/contract/useCase";
import { ICreateUserUseCaseProps } from "@application/use-cases/user/create/types";

export class CreateUserController {
  constructor(
    private createUserUseCase: UseCase<ICreateUserUseCaseProps, void>
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { confirmPassword, ...data } = ZodValidatorError.parse(
      CreateUserValidator,
      request.body
    );

    await this.createUserUseCase.execute(data);

    return HttpResponse.created(null, reply);
  }
}
