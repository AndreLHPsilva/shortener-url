import { ICreateLogWhenUpdateUseCaseProps } from "./types.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded.js";
import { IShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlLogsRepository.interface.js";
import { ShortUrlLog } from "@domain/entities/ShortUrlLog.entity.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";
import { EActionShortUrlLog } from "@domain/interfaces/shortUrlLog.interface.js";

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

    return;
  }
}
