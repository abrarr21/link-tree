import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  MONGODB_URI: z.string(),
  NODE_ENV: z.string(),
  PINO_LOG_LEVEL: z.string(),
  JWT_SECRET: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    "Environment validation failed",
    JSON.stringify(env.error.issues, null, 2),
  );
  process.exit(1);
}

export default env.data;
