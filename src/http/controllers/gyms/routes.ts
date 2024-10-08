import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
//
export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);
}
