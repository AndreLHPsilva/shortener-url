import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue.js";
import { AppError } from "./AppError.js";

export class IdentifierNotMatchRulesError extends AppError {
  constructor() {
    super(
      `Identifier not match rules (length: ${IdentifierObjValue.length})`,
      400,
      "IDENTIFIER_NOT_MATCH_RULES"
    );
  }
}
