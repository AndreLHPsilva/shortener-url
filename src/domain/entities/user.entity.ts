import { toSpISOString } from "@shared/utils/date/index.js";

export class User {
  static create(
    id: string | null,
    name: string,
    email: string,
    password: string
  ) {
    const date = toSpISOString();
    return new User(id, name, email, password, date, date);
  }

  constructor(
    private id: string | null = null,
    private name: string,
    private email: string,
    private password: string,
    private createdAt: string,
    private updatedAt: string
  ) {}

  getProps() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
