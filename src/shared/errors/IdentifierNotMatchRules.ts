import { IdentifierObjValue } from "@domain/objectValues/identifier.objValue";
import { AppError } from "./AppError";

export class IdentifierNotMatchRulesError extends AppError {
  constructor() {
    super(
      `Identifier not match rules (length: ${IdentifierObjValue.length})`,
      400,
      "IDENTIFIER_NOT_MATCH_RULES"
    );
  }
}
