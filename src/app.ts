import fastify from "fastify";
import { env } from "src/env";
import { appRoutes } from "src/http/routes";
import { ZodError } from "zod";
export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, req, res) => {
  if (error instanceof ZodError) {
    res
      .status(400)
      .send({ message: "validation error", issues: error.format() });
    return;
  }
  if (env.NODE_ENV === "dev") {
    console.error(error);
  } else {
    // aqui deve ter um serviço de log para armazenar o erro ex datalog/newrelic/sentry
  }
  res.status(500).send({ message: "Internal server error" });
});
