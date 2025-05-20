import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { HttpResponse } from "@shared/http/HttpResponse";

const authPlugin: FastifyPluginAsync = async (app) => {
  app.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        return HttpResponse.unauthorized("Unauthorized", reply);
      }
    }
  );
};

export default fp(authPlugin);
