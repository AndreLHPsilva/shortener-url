import { setAttributeActiveSpan } from "@lib/tracing";
import { ETelemetrySpanNames } from "@lib/tracing/types";
import { INTERNAL_ERRORS_CODE } from "@shared/errors/errors";
import { AppError } from "@shared/errors/AppError";
import { HttpResponse } from "@shared/http/HttpResponse";
import { removeSensiveData } from "@shared/utils/request/removeSensiveData";
import { ZodValidatorError } from "@shared/utils/zod/validator";
import { app } from "src/app";
import { ZodError } from "zod";

export function setupErrorHandler() {
  app.setErrorHandler((error, request, reply) => {
    const data = removeSensiveData(request.body);

    if (error.validation && error.code === "FST_ERR_VALIDATION") {
      const formatted = error.validation.map((v: any) => {
        return `${v.message}`;
      });

      const message = formatted.join("\n");

      setAttributeActiveSpan(ETelemetrySpanNames.ERROR_VALIDATION, {
        data,
        error: {
          message,
          code: INTERNAL_ERRORS_CODE.BAD_REQUEST,
        },
      });
      return HttpResponse.badRequest(message, reply);
    }

    if (error instanceof AppError) {
      setAttributeActiveSpan(ETelemetrySpanNames.ERROR_APP_ERROR, {
        data,
        error: {
          message: error.message,
          code: error.code,
        },
      });

      return HttpResponse.error(
        error.message,
        reply,
        error.code,
        error.statusCode
      );
    }

    if (error instanceof ZodError) {
      const message = ZodValidatorError.formatMessage(error);
      setAttributeActiveSpan(ETelemetrySpanNames.ERROR_ZOD_ERROR, {
        data,
        error: {
          message,
          code: INTERNAL_ERRORS_CODE.BAD_REQUEST,
        },
      });
      return HttpResponse.badRequest(message, reply);
    }

    if (error instanceof ZodValidatorError) {
      setAttributeActiveSpan(ETelemetrySpanNames.ERROR_ZOD_VALIDATION_ERROR, {
        data,
        error: {
          message: error.message,
          code: INTERNAL_ERRORS_CODE.BAD_REQUEST,
        },
      });

      return HttpResponse.badRequest(error.message, reply);
    }

    setAttributeActiveSpan(ETelemetrySpanNames.ERROR_INTERNAL_ERROR, {
      data,
      error: {
        message: error.message || "Internal server error",
        code: INTERNAL_ERRORS_CODE.INTERNAL_ERROR,
      },
    });

    HttpResponse.internalError(error.message || "Internal server error", reply);
  });
}
