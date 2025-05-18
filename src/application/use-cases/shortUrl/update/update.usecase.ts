import { UseCase } from "@application/use-cases/contract/useCase.js";
import { ShortUrl } from "@domain/entities/shortUrl.entity.js";
import { IdentifierObjValue } from "@domain/valueObjects/identifier.objValue.js";
import { LongUrlObjValue } from "@domain/valueObjects/longUrl.objValue.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";
import { FailedGenerateIdentifierError } from "@shared/errors/FailedGenerateIdentifierError.js";
import { IUpdateShortUrlUseCaseProps } from "./types.js";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded.js";

export class UpdateShortUrlUseCase extends UseCase<
  IUpdateShortUrlUseCaseProps,
  void
> {
  constructor(private repository: IShortUrlRepository) {
    super();
  }

  async execute({ shortUrlId, host }: IUpdateShortUrlUseCaseProps) {
    const shortUrl = await this.repository.findById(shortUrlId);

    if (!shortUrl) {
      throw new ShortUrlNotFoundedError();
    }

    shortUrl.setHost(host);

    await this.repository.update(shortUrl);

    return;
  }
}
