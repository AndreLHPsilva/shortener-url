import { IdentifierNotMatchRulesError } from "@shared/errors/IdentifierNotMatchRules.js";

export class IdentifierObjValue {
  private value: string;
  static length = 6;
  static maxAttemptsGenerateUniqueIdentifier = 20;
  static timeoutGenerateUniqueIdentifierMs = 3000;

  constructor(value: string) {
    if (value.length > IdentifierObjValue.length || value.length <= 0) {
      throw new IdentifierNotMatchRulesError();
    }

    this.value = value;
  }

  static create() {
    const value = this.generateCode();
    return new IdentifierObjValue(value);
  }

  getValue() {
    return this.value;
  }

  static generateCode(length = this.length) {
    const CHARSET =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    return Array.from(
      { length },
      () => CHARSET[Math.floor(Math.random() * CHARSET.length)]
    ).join("");
  }
}
