import { FastifyReply, FastifyRequest } from "fastify";
import { HttpResponse } from "@shared/http/HttpResponse.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { IUserJwt } from "@shared/types/types.js";
import {
  IListShortUrlResponse,
  IListShortUrlUseCaseProps,
} from "@application/use-cases/shortUrl/list/types.js";

export class ListShortUrlController {
  constructor(
    private listShortUrlUseCase: UseCase<
      IListShortUrlUseCaseProps,
      IListShortUrlResponse
    >
  ) {}
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const user = request?.user as IUserJwt;

    const resp = await this.listShortUrlUseCase.execute({ userId: user.id });

    return HttpResponse.success(resp, reply);
  }
}
