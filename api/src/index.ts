/**
 * index.ts
 * --------
 * Punto de entrada: conecta a MongoDB, crea la app y la pone a escuchar.
 * Ejecuta: npm run dev
 */

import { conectarDB } from "./conexionDB";
import { crearApp } from "./app";
import { env } from "./config/env";

async function main(): Promise<void> {
  await conectarDB();

  const app = crearApp();

  app.listen(env.puerto, "0.0.0.0", () => {
    console.log(`API del Departamento de Pawnee escuchando en http://localhost:${env.puerto}`);
    console.log(`Prueba: curl http://localhost:${env.puerto}/api/criaturas`);
  });
}

main();
