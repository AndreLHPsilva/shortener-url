import { CreateShortUrlUseCase } from "./create.usecase.js";
import { shortUrlRepositoryFactory } from "@infrastructure/factory/shortUrlRepository.factory.js";

const shortUrlRepository = shortUrlRepositoryFactory();
export const createShortUrlUseCase = new CreateShortUrlUseCase(
  shortUrlRepository
);
