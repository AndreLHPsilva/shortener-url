import { UseCase } from "@application/use-cases/contract/useCase.js";
import { ShortUrl } from "@domain/entities/shortUrl.entity.js";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue.js";
import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";
import { FailedGenerateIdentifierError } from "@shared/errors/FailedGenerateIdentifierError.js";
import { IUpdateShortUrlUseCaseProps } from "./types.js";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded.js";
import { ICreateLogWhenUpdateUseCaseProps } from "../createLogWhenUpdate/types.js";
import { EActionShortUrlLog } from "@domain/interfaces/shortUrlLog.interface.js";

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

  async execute({ shortUrlId, host, userId }: IUpdateShortUrlUseCaseProps) {
    const shortUrl = await this.repository.findById(shortUrlId);

    if (!shortUrl) {
      throw new ShortUrlNotFoundedError();
    }

    const props = shortUrl.getProps();
    const oldValue = props.host;

    shortUrl.setHost(host);

    await this.repository.update(shortUrl);
    await this.createLogWhenUpdateUseCase.execute({
      shortUrlId,
      userId,
      oldValue,
      newValue: host,
      action: EActionShortUrlLog.UPDATE,
    });

    return;
  }
}
