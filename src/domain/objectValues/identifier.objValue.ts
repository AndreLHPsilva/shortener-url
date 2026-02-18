import { IdentifierNotMatchRulesError } from "@shared/errors/IdentifierNotMatchRules";
import { IIdGenerator } from "@application/ports/types"; 
import { convertToBase } from "@shared/utils/convert";

export class IdentifierObjValue {
  private value: string;
  static maxLength = 8;
  static maxAttemptsGenerateUniqueIdentifier = 20;
  static timeoutGenerateUniqueIdentifierMs = 3000;

  constructor(value: string) {

    if (value.length <= 0 || value.length > IdentifierObjValue.maxLength) {
      throw new IdentifierNotMatchRulesError();
    }

    this.value = value;
  }

  static create(idGenerator: IIdGenerator): IdentifierObjValue {
    const idGenerated = idGenerator.nextId();
    const identifierString = convertToBase(idGenerated);

    return new IdentifierObjValue(identifierString);
  }

  getValue(): string {
    return this.value;
  }
}
