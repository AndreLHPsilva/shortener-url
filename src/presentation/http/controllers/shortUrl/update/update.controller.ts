import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator.js";
import { HttpResponse } from "@shared/http/HttpResponse.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { IUserJwt } from "@shared/types/types.js";
import { IUpdateShortUrlUseCaseProps } from "@application/use-cases/shortUrl/update/types.js";
import { UpdateShortUrlValidator } from "./types.js";

export class UpdateShortUrlController {
  constructor(
    private updateShortUrlUseCase: UseCase<IUpdateShortUrlUseCaseProps, void>
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    let data = {};
    if (typeof request.body === "object") {
      data = { ...request.body };
    }

    if (typeof request.params === "object") {
      data = { ...data, ...request.params };
    }

    const dataValidated = ZodValidatorError.parse(
      UpdateShortUrlValidator,
      data
    );

    const user = request?.user as IUserJwt;

    const resp = await this.updateShortUrlUseCase.execute({
      ...dataValidated,
      userId: user.id,
    });

    return HttpResponse.success(null, reply);
  }
}
