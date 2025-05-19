import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue.js";
import { IdentifierNotMatchRulesError } from "@shared/errors/IdentifierNotMatchRules.js";
import { describe, expect, test } from "vitest";

describe("Identifier Object Value", () => {
  test("should create new instance", () => {
    const identifier = IdentifierObjValue.create();

    expect(identifier).toBeDefined();
    expect(identifier).toBeInstanceOf(IdentifierObjValue);
  });

  test(`should generate unique identifier max ${IdentifierObjValue.length} characters`, () => {
    const identifier = IdentifierObjValue.create();
    const value = identifier.getValue();

    expect(value.length).toBe(IdentifierObjValue.length);
  });

  test("should throw error if identifier length is invalid", () => {
    expect(() => new IdentifierObjValue("1234567")).toThrow(
      IdentifierNotMatchRulesError
    );
  });
});
