import { FastifyReply } from "fastify";
import { INTERNAL_ERRORS_CODE } from "../errors";

export class HttpResponse {
  static success<T>(data: T, reply: FastifyReply, status = 200) {
    return reply.status(status).send(data);
  }

  static created<T>(data: T, reply: FastifyReply) {
    return this.success(data, reply, 201);
  }

  static noContent(reply: FastifyReply) {
    return reply.status(204).send();
  }

  static redirectContent(url: string, reply: FastifyReply, status = 302) {
    return reply.redirect(url, status);
  }

  static error(
    message: string,
    reply: FastifyReply,
    code = "INTERNAL_ERROR",
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
