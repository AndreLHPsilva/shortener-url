import { User } from "@domain/entities/user.entity";

export interface IUserRepository {
  create: (user: User) => Promise<any>;
  findByEmail: (email: string) => Promise<User | null>;
  findById: (id: string) => Promise<User | null>;
}