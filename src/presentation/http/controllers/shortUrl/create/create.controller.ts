import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator.js";
import { HttpResponse } from "@shared/http/HttpResponse.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { CreateShortUrlValidator } from "./types.js";
import {
  ICreateShortUrlResponse,
  ICreateShortUrlUseCaseProps,
} from "@application/use-cases/shortUrl/create/types.js";
import { IUserJwt } from "@shared/types/types.js";

export class CreateShortUrlController {
  constructor(
    private createShortUrlUseCase: UseCase<
      ICreateShortUrlUseCaseProps,
      ICreateShortUrlResponse
    >
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const dataValidated = ZodValidatorError.parse(
      CreateShortUrlValidator,
      request.body
    );

    const user = request?.user as IUserJwt;
    const userId = user ? user.id : null;

    const resp = await this.createShortUrlUseCase.execute({
      ...dataValidated,
      userId,
    });

    return HttpResponse.created(resp, reply);
  }
}
