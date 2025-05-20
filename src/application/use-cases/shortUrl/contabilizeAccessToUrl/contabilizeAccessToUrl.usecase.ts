import { AccessShortUrlLog } from "@domain/entities/accessShortUrlLog.entity";
import { IContabilizeAccessToUrlUseCaseProps } from "./types";
import { UseCase } from "@application/use-cases/contract/useCase";
import { IAccessShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/accessShortUrlLogsRepository.interface";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

export class ContabilizeAccessToUrlUseCase extends UseCase<
  IContabilizeAccessToUrlUseCaseProps,
  void
> {
  constructor(
    private repository: IAccessShortUrlLogsRepository,
    private shortUrlRepository: IShortUrlRepository
  ) {
    super();
  }

  async execute({ shortUrlId, ip }: IContabilizeAccessToUrlUseCaseProps) {
    const shortUrl = await this.shortUrlRepository.findById(shortUrlId);

    if (!shortUrl) {
      throw new ShortUrlNotFoundedError();
    }

    const accessShortUrlLog = AccessShortUrlLog.create(null, ip, shortUrl);
    await this.repository.create(accessShortUrlLog);

    setAttributeActiveSpan(ETelemetrySpanNames.PAYLOAD_USE_CASE, {
      accessShortUrlLog: accessShortUrlLog.getProps(),
    });

    return;
  }
}
