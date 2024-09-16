import { authenticate } from "@/http/controllers/users/authenticate";
import { profile } from "@/http/controllers/users/profile";
import { register } from "@/http/controllers/users/register";
import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
//
export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register); // route for registering a user / signup
  app.post("/sessions", authenticate); // route for authenticating a user / login

  // authenticated routes

  app.get("/me", { onRequest: [verifyJwt] }, profile); // route for getting the user's profile
}
