import { gymsRoutes } from "@/http/controllers/gyms/routes";
import { usersRoutes } from "@/http/controllers/users/routes";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { env } from "src/env";
import { ZodError } from "zod";
export const app = fastify();

app.register(fastifyJwt, { secret: env.JWT_SECRET });

app.register(usersRoutes);
app.register(gymsRoutes);

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
