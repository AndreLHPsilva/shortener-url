import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator";
import { HttpResponse } from "@shared/http/HttpResponse";
import { UseCase } from "@application/use-cases/contract/useCase";
import { IUserJwt } from "@shared/types/types";
import { IUpdateShortUrlUseCaseProps } from "@application/use-cases/shortUrl/update/types";
import { UpdateShortUrlValidator } from "./types";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

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

    setAttributeActiveSpan(ETelemetrySpanNames.PAYLOAD_CONTROLLER, {
      dataValidated,
      user,
    });

    await this.updateShortUrlUseCase.execute({
      ...dataValidated,
      userId: user.id,
    });

    return HttpResponse.success(null, reply);
  }
}
