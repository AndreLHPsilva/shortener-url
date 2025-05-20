import { ICreateShortUrlResponse, ICreateShortUrlUseCaseProps } from "./types";
import { UseCase } from "@application/use-cases/contract/useCase";
import { ShortUrl } from "@domain/entities/shortUrl.entity";
import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue";
import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface";
import { FailedGenerateIdentifierError } from "@shared/errors/FailedGenerateIdentifierError";

export class CreateShortUrlUseCase extends UseCase<
  ICreateShortUrlUseCaseProps,
  ICreateShortUrlResponse
> {
  constructor(private repository: IShortUrlRepository) {
    super();
  }

  async execute({
    longUrl,
    expiresIn,
    userId,
  }: ICreateShortUrlUseCaseProps): Promise<ICreateShortUrlResponse> {
    const longUrlClass = LongUrlObjValue.create(longUrl);

    const startGeneration = Date.now();
    let identifier: IdentifierObjValue | null = null;

    for (
      let attempt = 0;
      attempt < IdentifierObjValue.maxAttemptsGenerateUniqueIdentifier;
      attempt++
    ) {
      const diffNowAndStart = Date.now() - startGeneration;
      const isTimeout =
        diffNowAndStart > IdentifierObjValue.timeoutGenerateUniqueIdentifierMs;

      if (isTimeout) {
        throw new FailedGenerateIdentifierError();
      }

      identifier = IdentifierObjValue.create();
      const verifyAlreadyExists = await this.repository.findByIdentifier(
        identifier.getValue()
      );

      if (verifyAlreadyExists) {
        identifier = null;
        continue;
      }
    }

    if (!identifier) {
      throw new FailedGenerateIdentifierError();
    }

    const shortUrl = ShortUrl.create(
      null,
      longUrlClass,
      expiresIn,
      userId,
      identifier
    );

    await this.repository.create(shortUrl);

    return {
      shortUrl: `${process.env.BASE_URL}/${shortUrl
        .getProps()
        .identifier.getValue()}`,
    };
  }
}
