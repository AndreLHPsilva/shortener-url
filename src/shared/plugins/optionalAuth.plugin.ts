import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

const optionalAuthPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate(
    "optionalAuthenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        // Do nothing
      }
    }
  );
};

export default fp(optionalAuthPlugin);
