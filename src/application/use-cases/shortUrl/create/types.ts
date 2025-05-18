export interface ICreateShortUrlUseCaseProps {
  longUrl: string;
  expiresIn: string | null;
  userId: string | null;
}

export interface ICreateShortUrlResponse {
  shortUrl: string;
}
