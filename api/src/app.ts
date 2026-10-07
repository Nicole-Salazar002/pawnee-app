/**
 * app.ts
 * ------
 * Ensambla Express: middlewares globales, rutas de ambas colecciones,
 * y el middleware centralizado de errores al final.
 */

import fs from "fs";
import path from "path";
import express, { Express, Request, Response } from "express";
import { requestId } from "./middlewares/requestId";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { criaturasRouter } from "./routes/criaturas.routes";
import { avistamientosRouter } from "./routes/avistamientos.routes";
import { ApiError } from "./apiError";

function buscarFrontendDist(): string | null {
  const desdeEnv = process.env.FRONTEND_DIST
    ? path.resolve(process.cwd(), process.env.FRONTEND_DIST)
    : null;
  const candidatos = [
    desdeEnv,
    path.resolve(__dirname, "../../frontend/dist"),
    path.resolve(process.cwd(), "../frontend/dist"),
    path.resolve(process.cwd(), "frontend/dist"),
  ].filter((candidato): candidato is string => Boolean(candidato));

  for (const candidato of candidatos) {
    if (fs.existsSync(path.join(candidato, "index.html"))) {
      return candidato;
    }
  }
  return null;
}

export function crearApp(): Express {
  const app = express();

  app.use((req, res, next) => {
    const origenConfigurado = process.env.CORS_ORIGIN?.trim();
    const origen = origenConfigurado && origenConfigurado.length > 0 ? origenConfigurado : "*";
    res.setHeader("Access-Control-Allow-Origin", origen);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.use(express.json());
  app.use(requestId);
  app.use(logger);

  app.get("/api/salud", (req: Request, res: Response) => {
    res.json({ estado: "ok", requestId: req.id });
  });

  app.use("/api/criaturas", criaturasRouter);
  app.use("/api/avistamientos", avistamientosRouter);

  app.use((req: Request, res: Response, next) => {
    if (req.path.startsWith("/api")) {
      next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
      return;
    }
    next();
  });

  const frontendDist = buscarFrontendDist();
  if (frontendDist) {
    app.use(express.static(frontendDist));
    app.use((req: Request, res: Response, next) => {
      if (req.method !== "GET" && req.method !== "HEAD") {
        next();
        return;
      }
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  } else {
    app.use((req: Request, res: Response, next) => {
      next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
    });
  }

  app.use(errorHandler);

  return app;
}
