/**
 * config/env.ts
 * ---------------
 * ÚNICO archivo que lee variables de entorno directamente. El resto del
 * proyecto importa `env` desde aquí.
 */

import "dotenv/config";

interface Env {
  mongodbUri: string;
  mongodbDb: string;
  puerto: number;
}

function leerEnv(): Env {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error(
      "Falta MONGODB_URI en tu .env. Copia .env.example a .env y completa tu URI de Atlas."
    );
  }

  return {
    mongodbUri,
    mongodbDb: process.env.MONGODB_DB ?? "pawnee_mongoose",
    puerto: process.env.PORT ? Number(process.env.PORT) : 3000,
  };
}

export const env = leerEnv();
