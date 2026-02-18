import { getPidWorkerId } from "@shared/utils/pid";
import { CreateShortUrlUseCase } from "./create.usecase";
import { shortUrlRepositoryFactory } from "@infrastructure/factory/shortUrlRepository.factory";
import { Snowflake } from "@shared/utils/snowFlake/snowFlake";
import { IIdGenerator } from "@application/ports/types";
import { MAX_WORKER_ID_NUMBER } from "@shared/utils/snowFlake/snowFlake.constants";

export const makeCreateShortUrlUseCase = (): CreateShortUrlUseCase => {
  const workerId = getPidWorkerId(MAX_WORKER_ID_NUMBER);
  const idGenerator: IIdGenerator = new Snowflake(workerId);
  const shortUrlRepository = shortUrlRepositoryFactory();

  return new CreateShortUrlUseCase(
    shortUrlRepository,
    idGenerator
  );
};
