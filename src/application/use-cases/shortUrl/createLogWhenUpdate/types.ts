import { EActionShortUrlLog } from "@domain/interfaces/shortUrlLog.interface";

export interface ICreateLogWhenUpdateUseCaseProps {
  shortUrlId: string;
  userId: string;
  newValue: string;
  oldValue: string;
  action: EActionShortUrlLog;
}
