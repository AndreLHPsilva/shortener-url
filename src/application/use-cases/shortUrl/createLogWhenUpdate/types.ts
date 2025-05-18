import { EActionShortUrlLog } from "@domain/interfaces/shortUrlLog.interface.js";

export interface ICreateLogWhenUpdateUseCaseProps {
  shortUrlId: string;
  userId: string;
  newValue: string;
  oldValue: string;
  action: EActionShortUrlLog;
}
