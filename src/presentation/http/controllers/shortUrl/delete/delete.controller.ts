import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator";
import { HttpResponse } from "@shared/http/HttpResponse";
import { UseCase } from "@application/use-cases/contract/useCase";
import { IUserJwt } from "@shared/types/types";
import { DeleteShortUrlValidator } from "./types";
import { IDeleteShortUrlUseCaseProps } from "@application/use-cases/shortUrl/delete/types";

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
