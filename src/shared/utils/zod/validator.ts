import { ZodError, ZodIssue, ZodSchema } from "zod";

export class ZodValidatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZodValidatorError";
  }

  static fromZodError(error: ZodError): ZodValidatorError {
    const message = error.errors
      .map(
        (issue: ZodIssue) =>
          `${issue.path.join(".") || "field"}: ${issue.message}`
      )
      .join("\n");

    return new ZodValidatorError(message);
  }

  static formatMessage(error: ZodError): string {
    return error.issues.map((issue) => `${issue.message}`).join("\n");
  }

  static parse<T>(schema: ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      throw new ZodValidatorError(
        ZodValidatorError.formatMessage(error as ZodError)
      );
    }
  }
}
