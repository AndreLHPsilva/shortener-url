import { ILinks } from "@shared/types/types";

export interface IListShortUrlUseCaseProps {
  userId: string;
}
export interface IListShortUrl {
  id: string;
  longUrl: string;
  shortUrl: string;
  sumAccess: number;
  createdAt: string;
  updatedAt: string;
  links: ILinks[];
}

export interface IListShortUrlResponse {
  shortUrls: IListShortUrl[];
}
