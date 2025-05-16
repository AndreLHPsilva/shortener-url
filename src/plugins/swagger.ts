import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function swaggerPlugin(app: FastifyInstance) {
  await app.register(swagger, {
    mode: "dynamic",
    openapi: {
      info: {
        title: "Shortener URL API",
        description: "A simple API for shortening long URLs, making them easier to share and manage.",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}
