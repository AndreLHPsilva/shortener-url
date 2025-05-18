import { ICreateLogWhenUpdateUseCaseProps } from "./types.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded.js";
import { IShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlLogsRepository.interface.js";
import { ShortUrlLog } from "@domain/entities/ShortUrlLog.entity.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";

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
  }: ICreateLogWhenUpdateUseCaseProps) {
    const shortUrl = await this.shortUrlRepository.findById(shortUrlId);

    if (!shortUrl) {
      throw new ShortUrlNotFoundedError();
    }

    const shortUrlLog = ShortUrlLog.create(
      null,
      shortUrlId,
      userId,
      newValue,
      oldValue,
      shortUrl
    );

    await this.repository.create(shortUrlLog);

    return;
  }
}
