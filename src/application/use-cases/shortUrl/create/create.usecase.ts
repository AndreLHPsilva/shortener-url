import {
  ICreateShortUrlResponse,
  ICreateShortUrlUseCaseProps,
} from "./types.js";
import { UseCase } from "@application/use-cases/contract/useCase.js";
import { ShortUrl } from "@domain/entities/shortUrl.entity.js";
import { IdentifierObjValue } from "@domain/valueObjects/identifier.objValue.js";
import { LongUrlObjValue } from "@domain/valueObjects/longUrl.objValue.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";
import { FailedGenerateIdentifierError } from "@shared/errors/FailedGenerateIdentifierError.js";

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
    let identifier: string | null = null;

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

      identifier = IdentifierObjValue.generateCode();
      const verifyAlreadyExists = await this.repository.findByIdentifier(
        identifier
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
      shortUrl: `${process.env.BASE_URL}/${shortUrl.getProps().identifier}`,
    };
  }
}
