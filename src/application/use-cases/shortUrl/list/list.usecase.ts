import { UseCase } from "@application/use-cases/contract/useCase.js";
import { IShortUrlRepository } from "@infrastructure/prisma/shortUrl/contract/shortUrlRepository.interface.js";
import {
  IListShortUrl,
  IListShortUrlResponse,
  IListShortUrlUseCaseProps,
} from "./types.js";

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

    return {
      shortUrls: transformedDatas,
    };
  }
}
