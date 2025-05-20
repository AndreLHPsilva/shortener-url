import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator";
import { HttpResponse } from "@shared/http/HttpResponse";
import { CreateUserValidator } from "./types";
import { UseCase } from "@application/use-cases/contract/useCase";
import { ICreateUserUseCaseProps } from "@application/use-cases/user/create/types";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

export class CreateUserController {
  constructor(
    private createUserUseCase: UseCase<ICreateUserUseCaseProps, void>
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { confirmPassword, ...data } = ZodValidatorError.parse(
      CreateUserValidator,
      request.body
    );

    setAttributeActiveSpan(ETelemetrySpanNames.PAYLOAD_CONTROLLER, {
      email: data.email,
      name: data.name,
    });

    await this.createUserUseCase.execute(data);

    return HttpResponse.created(null, reply);
  }
}
