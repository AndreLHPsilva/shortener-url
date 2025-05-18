import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator.js";
import { HttpResponse } from "@shared/http/HttpResponse.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { IUserJwt } from "@shared/types/types.js";
import { DeleteShortUrlValidator } from "./types.js";
import { IDeleteShortUrlUseCaseProps } from "@application/use-cases/shortUrl/delete/types.js";

export class DeleteShortUrlController {
  constructor(
    private deleteShortUrlUseCase: UseCase<IDeleteShortUrlUseCaseProps, void>
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const dataValidated = ZodValidatorError.parse(
      DeleteShortUrlValidator,
      request.params
    );

    const user = request?.user as IUserJwt;

    await this.deleteShortUrlUseCase.execute({
      ...dataValidated,
      userId: user.id,
    });

    return HttpResponse.success(null, reply);
  }
}
