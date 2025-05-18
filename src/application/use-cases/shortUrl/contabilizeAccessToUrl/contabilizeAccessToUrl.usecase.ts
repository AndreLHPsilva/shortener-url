import { AccessShortUrlLog } from "@domain/entities/accessShortUrlLog.entity.js";
import { IContabilizeAccessToUrlUseCaseProps } from "./types.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { IAccessShortUrlLogsRepository } from "@infrastructure/prisma/shortUrl/contract/accessShortUrlLogsRepository.interface.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded.js";

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

    return;
  }
}
