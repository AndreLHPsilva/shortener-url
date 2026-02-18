import { IIdGenerator } from "@application/ports/types";
import { ICreateShortUrlResponse, ICreateShortUrlUseCaseProps } from "./types";
import { UseCase } from "@application/use-cases/contract/useCase";
import { ShortUrl } from "@domain/entities/shortUrl.entity";
import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue";

export class CreateShortUrlUseCase extends UseCase<
  ICreateShortUrlUseCaseProps,
  ICreateShortUrlResponse
> {
  constructor(private repository: IShortUrlRepository, private idGenerator: IIdGenerator) {
    super();
  }

  async execute({
    longUrl,
    expiresIn,
    userId,
  }: ICreateShortUrlUseCaseProps): Promise<ICreateShortUrlResponse> {
    const longUrlClass = LongUrlObjValue.create(longUrl);

    const identifier = IdentifierObjValue.create(this.idGenerator)

    const shortUrl = ShortUrl.create(
      null,
      longUrlClass,
      expiresIn,
      userId,
      identifier
    );

    await this.repository.create(shortUrl);

    const response = {
      shortUrl: shortUrl.getShortUrl(),
    };

    setAttributeActiveSpan(ETelemetrySpanNames.RESPONSE_USE_CASE, response);

    return response;
  }
}
