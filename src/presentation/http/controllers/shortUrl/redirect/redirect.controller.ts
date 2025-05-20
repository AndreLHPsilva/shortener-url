import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidatorError } from "@shared/utils/zod/validator";
import { HttpResponse } from "@shared/http/HttpResponse";
import { UseCase } from "@application/use-cases/contract/useCase";
import { RedirectShortUrlValidator } from "./types";
import {
  IRedirectShortUrlResponse,
  IRedirectShortUrlUseCaseProps,
} from "@application/use-cases/shortUrl/redirect/types";

export class RedirectShortUrlController {
  constructor(
    private redirectShortUrlUseCase: UseCase<
      IRedirectShortUrlUseCaseProps,
      IRedirectShortUrlResponse
    >
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const dataValidated = ZodValidatorError.parse(
      RedirectShortUrlValidator,
      request.params
    );

    const { shortUrl } = await this.redirectShortUrlUseCase.execute({
      identifierShortUrl: dataValidated.identifierShortUrl,
      ip: request.ip,
    });
    const urlMonted = shortUrl.getUrl();

    return HttpResponse.redirectContent(urlMonted, reply);
  }
}
