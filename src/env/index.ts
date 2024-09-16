import "dotenv/config";
import { z } from "zod";
//validar variáveis de ambiente

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
}); //definir o schema de validação das variáveis de ambiente

const _env = envSchema.safeParse(process.env); //valida as variáveis de ambiente

if (!_env.success) {
  console.error("🚨 invalid env variables", _env.error.format()); //se não for válido, exibe o erro
  throw new Error("🚨 invalid env variables"); //e lança um erro
} //se for válido, exibe as variáveis de ambiente

export const env = _env.data; //exporta as variáveis de ambiente
