import { UseCase } from "@application/use-cases/contract/useCase";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface";
import { IUpdateShortUrlUseCaseProps } from "./types";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded";
import { ICreateLogWhenUpdateUseCaseProps } from "../createLogWhenUpdate/types";
import { EActionShortUrlLog } from "@domain/interfaces/shortUrlLog.interface";
import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

export class UpdateShortUrlUseCase extends UseCase<
  IUpdateShortUrlUseCaseProps,
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

  async execute({ shortUrlId, newUrl, userId }: IUpdateShortUrlUseCaseProps) {
    const shortUrl = await this.repository.findById(shortUrlId);

    if (!shortUrl) {
      throw new ShortUrlNotFoundedError();
    }

    const oldValue = shortUrl.getUrl();

    const longUrl = LongUrlObjValue.create(newUrl);
    shortUrl.update(longUrl);

    await this.repository.update(shortUrl);

    const dataCreateLog = {
      shortUrlId,
      userId,
      oldValue,
      newValue: shortUrl.getUrl(),
      action: EActionShortUrlLog.UPDATE,
    };
    await this.createLogWhenUpdateUseCase.execute(dataCreateLog);

    setAttributeActiveSpan(ETelemetrySpanNames.PAYLOAD_USE_CASE, {
      shortUrl: shortUrl.getProps(),
      dataCreateLog,
    });

    return;
  }
}
