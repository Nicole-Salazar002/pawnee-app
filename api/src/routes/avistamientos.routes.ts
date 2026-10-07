/**
 * routes/avistamientos.routes.ts
 * ----------------------------------
 * Define las rutas de /api/avistamientos.
 */

import { Router } from "express";
import * as avistamientosController from "../controllers/avistamientos.controller";

export const avistamientosRouter = Router();

avistamientosRouter.get("/", avistamientosController.listar);
avistamientosRouter.get("/:id", avistamientosController.obtenerPorId);
avistamientosRouter.post("/", avistamientosController.crear);
avistamientosRouter.put("/:id", avistamientosController.actualizar);
avistamientosRouter.delete("/:id", avistamientosController.eliminar);
