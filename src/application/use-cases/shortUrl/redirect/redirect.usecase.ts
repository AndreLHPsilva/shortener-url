import {
  IRedirectShortUrlResponse,
  IRedirectShortUrlUseCaseProps,
} from "./types.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded.js";
import { IContabilizeAccessToUrlUseCaseProps } from "../contabilizeAccessToUrl/types.js";

export class RedirectShortUrlUseCase extends UseCase<
  IRedirectShortUrlUseCaseProps,
  IRedirectShortUrlResponse
> {
  constructor(
    private repository: IShortUrlRepository,
    private contabilizeAccessToUrlUseCase: UseCase<
      IContabilizeAccessToUrlUseCaseProps,
      void
    >
  ) {
    super();
  }

  async execute({ identifierShortUrl, ip }: IRedirectShortUrlUseCaseProps) {
    const shortUrl = await this.repository.findByIdentifier(identifierShortUrl);

    if (!shortUrl) {
      throw new ShortUrlNotFoundedError();
    }

    await this.contabilizeAccessToUrlUseCase.execute({
      shortUrlId: shortUrl.getProps().id!,
      ip,
    });

    return {
      shortUrl,
    };
  }
}
