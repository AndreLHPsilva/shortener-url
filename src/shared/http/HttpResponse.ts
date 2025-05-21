import { FastifyReply } from "fastify";
import { setAttributeActiveSpan } from "@lib/tracing";
import { INTERNAL_ERRORS_CODE } from "@shared/errors/errors";

export class HttpResponse {
  static success<T>(data: T, reply: FastifyReply, status = 200) {
    setAttributeActiveSpan("http.success_http_response", data);
    return reply.status(status).send(data);
  }

  static created<T>(data: T, reply: FastifyReply) {
    return this.success(data, reply, 201);
  }

  static noContent(reply: FastifyReply) {
    return reply.status(204).send();
  }

  static redirectContent(url: string, reply: FastifyReply, status = 302) {
    setAttributeActiveSpan("http.redirect_content_response", { url, status });

    return reply.redirect(url, status);
  }

  static error(
    message: string,
    reply: FastifyReply,
    code = INTERNAL_ERRORS_CODE.INTERNAL_ERROR,
    status = 500
  ) {
    return reply.status(status).send({
      error: {
        message,
        code,
      },
    });
  }

  static badRequest(message: string, reply: FastifyReply) {
    return this.error(message, reply, INTERNAL_ERRORS_CODE.BAD_REQUEST, 400);
  }

  static unauthorized(message: string, reply: FastifyReply) {
    return this.error(message, reply, INTERNAL_ERRORS_CODE.UNAUTHORIZED, 401);
  }

  static notFound(message: string, reply: FastifyReply) {
    return this.error(message, reply, INTERNAL_ERRORS_CODE.NOT_FOUND, 404);
  }

  static internalError(message: string, reply: FastifyReply) {
    return this.error(message, reply, INTERNAL_ERRORS_CODE.INTERNAL_ERROR, 404);
  }
}
