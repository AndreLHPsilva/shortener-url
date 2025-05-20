import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator";
import { HttpResponse } from "@shared/http/HttpResponse";
import { UseCase } from "@application/use-cases/contract/useCase";
import { RedirectShortUrlValidator } from "./types";
import {
  IRedirectShortUrlResponse,
  IRedirectShortUrlUseCaseProps,
} from "@application/use-cases/shortUrl/redirect/types";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

export class RedirectShortUrlController {
  constructor(
    private redirectShortUrlUseCase: UseCase<
      IRedirectShortUrlUseCaseProps,
      IRedirectShortUrlResponse
    >
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { identifierShortUrl } = ZodValidatorError.parse(
      RedirectShortUrlValidator,
      request.params
    );

    setAttributeActiveSpan(ETelemetrySpanNames.PAYLOAD_CONTROLLER, {
      identifierShortUrl,
      ip: request.ip,
    });

    const { shortUrl } = await this.redirectShortUrlUseCase.execute({
      identifierShortUrl,
      ip: request.ip,
    });

    const urlMonted = shortUrl.getUrl();

    return HttpResponse.redirectContent(urlMonted, reply);
  }
}
