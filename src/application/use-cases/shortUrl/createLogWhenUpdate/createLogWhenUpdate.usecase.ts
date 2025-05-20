import { ICreateLogWhenUpdateUseCaseProps } from "./types";
import { UseCase } from "@application/use-cases/contract/useCase";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded";
import { IShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlLogsRepository.interface";
import { ShortUrlLog } from "@domain/entities/shortUrlLog.entity";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface";
import { EActionShortUrlLog } from "@domain/interfaces/shortUrlLog.interface";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

export class CreateLogWhenUpdateUseCase extends UseCase<
  ICreateLogWhenUpdateUseCaseProps,
  void
> {
  constructor(
    private repository: IShortUrlLogsRepository,
    private shortUrlRepository: IShortUrlRepository
  ) {
    super();
  }

  async execute({
    shortUrlId,
    userId,
    newValue,
    oldValue,
    action = EActionShortUrlLog.UPDATE,
  }: ICreateLogWhenUpdateUseCaseProps) {
    const shortUrl = await this.shortUrlRepository.findById(shortUrlId, true);

    if (!shortUrl) {
      throw new ShortUrlNotFoundedError();
    }

    const shortUrlLog = ShortUrlLog.create(
      null,
      shortUrlId,
      userId,
      newValue,
      oldValue,
      action,
      shortUrl
    );

    await this.repository.create(shortUrlLog);

    setAttributeActiveSpan(ETelemetrySpanNames.PAYLOAD_USE_CASE, {
      shortUrl: shortUrlLog.getProps(),
    });

    return;
  }
}
