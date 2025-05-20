import { UseCase } from "@application/use-cases/contract/useCase";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface";
import {
  IListShortUrl,
  IListShortUrlResponse,
  IListShortUrlUseCaseProps,
} from "./types";
import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";

export class ListShortUrlUseCase extends UseCase<
  IListShortUrlUseCaseProps,
  IListShortUrlResponse
> {
  constructor(private repository: IShortUrlRepository) {
    super();
  }

  async execute({ userId }: IListShortUrlUseCaseProps) {
    const shortUrls = await this.repository.findByUserId(userId, true);

    const transformedDatas: IListShortUrl[] = shortUrls.map((shortUrl) => {
      const data = shortUrl.getProps();
      const links = shortUrl.gerenateLinks();

      return {
        longUrl: shortUrl.getUrl(),
        id: data.id!,
        shortUrl: shortUrl.getShortUrl(),
        sumAccess: data.sumAccess,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        ...links,
      };
    });

    const response = {
      shortUrls: transformedDatas,
    };

    setAttributeActiveSpan(ETelemetrySpanNames.RESPONSE_USE_CASE, response);

    return response;
  }
}
