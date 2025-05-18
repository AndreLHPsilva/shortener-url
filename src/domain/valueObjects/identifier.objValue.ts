export class IdentifierObjValue {
  private value: string;
  static maxAttemptsGenerateUniqueIdentifier = 20;
  static timeoutGenerateUniqueIdentifierMs = 3000

  constructor(value: string) {
    if (value.length > 6 || value.length <= 0) {
      throw new Error("Identifier must be less than 6 characters");
    }

    this.value = value;
  }

  getValue() {
    return this.value;
  }

  static generateCode(length = 6) {
    const CHARSET =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    return Array.from(
      { length },
      () => CHARSET[Math.floor(Math.random() * CHARSET.length)]
    ).join("");
  }
}
