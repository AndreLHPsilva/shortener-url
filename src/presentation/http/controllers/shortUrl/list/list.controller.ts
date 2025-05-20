import { FastifyReply, FastifyRequest } from "fastify";
import { HttpResponse } from "@shared/http/HttpResponse";
import { UseCase } from "@application/use-cases/contract/useCase";
import { IUserJwt } from "@shared/types/types";
import {
  IListShortUrlResponse,
  IListShortUrlUseCaseProps,
} from "@application/use-cases/shortUrl/list/types";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

export class ListShortUrlController {
  constructor(
    private listShortUrlUseCase: UseCase<
      IListShortUrlUseCaseProps,
      IListShortUrlResponse
    >
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const user = request?.user as IUserJwt;

    setAttributeActiveSpan(ETelemetrySpanNames.PAYLOAD_CONTROLLER, {
      user,
    });

    const resp = await this.listShortUrlUseCase.execute({ userId: user.id });

    return HttpResponse.success(resp, reply);
  }
}
