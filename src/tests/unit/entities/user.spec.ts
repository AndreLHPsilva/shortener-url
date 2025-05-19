import { User } from "@domain/entities/user.entity.js";
import { describe, expect, test } from "vitest";

describe("User Entity", () => {
  test("should create new instance", () => {
    const userData = {
      name: "name",
      email: "email",
      password: "password",
    };
    const user = User.create(
      null,
      userData.name,
      userData.email,
      userData.password
    );

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);

    const props = user.getProps();
    expect(props.name).toBe(userData.name);
    expect(props.email).toBe(userData.email);
    expect(props.password).toBe(userData.password);
  });
});
