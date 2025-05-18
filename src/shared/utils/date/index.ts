import { formatInTimeZone } from "date-fns-tz";

export function toSpISOString(date: Date = new Date()): string {
  return formatInTimeZone(
    date,
    "America/Sao_Paulo",
    "yyyy-MM-dd'T'HH:mm:ssXXX"
  );
}
