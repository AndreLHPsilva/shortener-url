import { LongUrlObjValue } from "@domain/objectValues/longUrl.objValue.js";
import { describe, expect, test } from "vitest";

describe("LongUrl Object Value", () => {
  test("should create new instance", () => {
    const longUrlClass = LongUrlObjValue.create("https://teste.com.br/testes");

    expect(longUrlClass).toBeDefined();
    expect(longUrlClass).toBeInstanceOf(LongUrlObjValue);
    const props = longUrlClass.getProps();
    expect(props.host).toBe("teste.com.br");
    expect(props.path).toBe("/testes");
    expect(props.protocol).toBe("https:");
  });
});
