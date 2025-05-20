import { app } from "./app";

async function bootstrap() {
  try {
    app.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });

    console.log("Server running on http://localhost:3000");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

bootstrap();
