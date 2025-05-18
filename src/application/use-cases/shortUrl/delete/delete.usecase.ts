import { UseCase } from "@application/use-cases/contract/useCase.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded.js";
import { ICreateLogWhenUpdateUseCaseProps } from "../createLogWhenUpdate/types.js";
import { IDeleteShortUrlUseCaseProps } from "./types.js";
import { EActionShortUrlLog } from "@domain/interfaces/shortUrlLog.interface.js";

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

    await this.createLogWhenUpdateUseCase.execute({
      shortUrlId,
      userId,
      newValue: shortUrl.getProps().host,
      oldValue: shortUrl.getProps().host,
      action: EActionShortUrlLog.DELETE,
    });

    return;
  }
}
