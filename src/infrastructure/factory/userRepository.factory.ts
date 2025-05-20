import { UserInMemoryRepository } from "@infrastructure/inMemory/user/userInMemory.repository";
import { UserRepository } from "@infrastructure/prisma/user/user.repository";

export function userRepositoryFactory() {
  if (process.env.NODE_ENV === "test") {
    return new UserInMemoryRepository();
  }

  return new UserRepository();
}
