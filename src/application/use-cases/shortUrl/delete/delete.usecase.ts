import { UseCase } from "@application/use-cases/contract/useCase";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded";
import { ICreateLogWhenUpdateUseCaseProps } from "../createLogWhenUpdate/types";
import { IDeleteShortUrlUseCaseProps } from "./types";
import { EActionShortUrlLog } from "@domain/interfaces/shortUrlLog.interface";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

export class DeleteShortUrlUseCase extends UseCase<
  IDeleteShortUrlUseCaseProps,
  void
> {
  constructor(
    private repository: IShortUrlRepository,
    private createLogWhenUpdateUseCase: UseCase<
      ICreateLogWhenUpdateUseCaseProps,
      void
    >
  ) {
    super();
  }

  async execute({ shortUrlId, userId }: IDeleteShortUrlUseCaseProps) {
    const shortUrl = await this.repository.findById(shortUrlId);

    if (!shortUrl) {
      throw new ShortUrlNotFoundedError();
    }

    shortUrl.delete();
    await this.repository.update(shortUrl);

    const dataCreateLog = {
      shortUrlId,
      userId,
      newValue: shortUrl.getProps().host,
      oldValue: shortUrl.getProps().host,
      action: EActionShortUrlLog.DELETE,
    };
    await this.createLogWhenUpdateUseCase.execute(dataCreateLog);

    setAttributeActiveSpan(ETelemetrySpanNames.PAYLOAD_USE_CASE, {
      shortUrl: shortUrl.getProps(),
      dataCreateLog,
    });

    return;
  }
}
