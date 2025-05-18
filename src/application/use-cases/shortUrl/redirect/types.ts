import { ShortUrl } from "@domain/entities/shortUrl.entity.js";

export interface IRedirectShortUrlUseCaseProps {
  identifierShortUrl: string;
  ip: string;
}

export interface IRedirectShortUrlResponse {
  shortUrl: ShortUrl;
}
