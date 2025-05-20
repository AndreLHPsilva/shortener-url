import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator";
import { HttpResponse } from "@shared/http/HttpResponse";
import { UseCase } from "@application/use-cases/contract/useCase";
import { CreateShortUrlValidator } from "./types";
import {
  ICreateShortUrlResponse,
  ICreateShortUrlUseCaseProps,
} from "@application/use-cases/shortUrl/create/types";
import { IUserJwt } from "@shared/types/types";

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
