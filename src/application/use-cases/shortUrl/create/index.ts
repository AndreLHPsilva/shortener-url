import { CreateShortUrlUseCase } from "./create.usecase";
import { shortUrlRepositoryFactory } from "@infrastructure/factory/shortUrlRepository.factory";

const shortUrlRepository = shortUrlRepositoryFactory();
export const createShortUrlUseCase = new CreateShortUrlUseCase(
  shortUrlRepository
);
