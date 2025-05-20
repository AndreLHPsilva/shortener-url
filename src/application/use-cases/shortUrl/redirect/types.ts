import { ShortUrl } from "@domain/entities/shortUrl.entity";

export interface IRedirectShortUrlUseCaseProps {
  identifierShortUrl: string;
  ip: string;
}

export interface IRedirectShortUrlResponse {
  shortUrl: ShortUrl;
}
