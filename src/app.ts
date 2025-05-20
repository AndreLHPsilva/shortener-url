import dotenv from "dotenv";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { authRoutes } from "./presentation/http/routes/auth/index.route";
import { fastify } from "fastify";
import fastifyJwt from "@fastify/jwt";
import authPlugin from "@shared/plugins/auth.plugin";
import optionalAuthPlugin from "@shared/plugins/optionalAuth.plugin";
import { shortUrlRoutes } from "@presentation/http/routes/shortUrl/index.route";
import { userRoutes } from "@presentation/http/routes/user/index";
import { redirectShortUrlRoute } from "@presentation/http/routes/shortUrl/redirect.route";
import { setupErrorHandler } from "@shared/errorHandler";

dotenv.config();

export const app = fastify({
  logger: false,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, { origin: "*" });
app.register(authPlugin);
app.register(optionalAuthPlugin);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Shortener URL API",
      description:
        "A simple API for shortening long URLs, making them easier to share and manage.",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

setupErrorHandler();

app.get("/health-check", async (request, reply) => {
  return { status: "ok" };
});

app.register(authRoutes, { prefix: "/auth" });
app.register(userRoutes, { prefix: "/users" });
app.register(shortUrlRoutes, { prefix: "/short-urls" });
app.register(redirectShortUrlRoute);

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});
