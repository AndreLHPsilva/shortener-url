import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

const fastify = Fastify({
  logger: true,
});

async function main() {
  fastify.listen(
    { port: Number(process.env.PORT) ?? 3000 },
    function (err, address) {
      console.log("server listening on", address);
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    }
  );
}

main();