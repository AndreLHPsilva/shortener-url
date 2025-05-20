import {
  IRedirectShortUrlResponse,
  IRedirectShortUrlUseCaseProps,
} from "./types";
import { UseCase } from "@application/use-cases/contract/useCase";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface";
import { ShortUrlNotFoundedError } from "@shared/errors/ShortUrlNotFounded";
import { IContabilizeAccessToUrlUseCaseProps } from "../contabilizeAccessToUrl/types";
import { toSpISOString } from "@shared/utils/date";
import { ShortUrlExpired } from "@shared/errors/ShortUrlExpired";

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

    const expiresIn = shortUrl.getProps().expiresIn;

    if (expiresIn) {
      const isExpired = toSpISOString() > expiresIn;
      if (isExpired) {
        throw new ShortUrlExpired();
      }
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
