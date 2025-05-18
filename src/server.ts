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
import { authRoutes } from "./presentation/http/routes/auth/index.route.js";
import { fastify } from "fastify";
import { ZodError } from "zod";
import { ZodValidatorError } from "./shared/utils/zod/validator.js";
import { HttpResponse } from "./shared/http/HttpResponse.js";
import { AppError } from "@shared/errors/AppError.js";
import fastifyJwt from "@fastify/jwt";
import authPlugin from "@shared/plugins/auth.plugin.js";
import optionalAuthPlugin from "@shared/plugins/optionalAuth.plugin.js";
import { shortUrlRoutes } from "@presentation/http/routes/shortUrl/index.route.js";
import { userRoutes } from "@presentation/http/routes/user/index.js";

dotenv.config();

const app = fastify({
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

app.setErrorHandler((error, request, reply) => {
  if (error.validation && error.code === "FST_ERR_VALIDATION") {
    const formatted = error.validation.map((v: any) => {
      return `${v.message}`;
    });

    const message = formatted.join("\n");
    return HttpResponse.badRequest(message, reply);
  }

  if (error instanceof AppError) {
    return HttpResponse.error(
      error.message,
      reply,
      error.code,
      error.statusCode
    );
  }

  if (error instanceof ZodError) {
    const message = ZodValidatorError.formatMessage(error);
    return HttpResponse.badRequest(message, reply);
  }

  if (error instanceof ZodValidatorError) {
    return HttpResponse.badRequest(error.message, reply);
  }

  HttpResponse.internalError(error.message || "Internal server error", reply);
});

app.register(authRoutes, { prefix: "/auth" });
app.register(userRoutes, { prefix: "/users" });
app.register(shortUrlRoutes, { prefix: "/short-urls" });

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});

app
  .listen({
    port: Number(process.env.PORT) || 3000,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server running...");
  })
  .catch((err) => {
    console.log(err);
    app.log.error(err);
    process.exit(1);
  });

export { app };
