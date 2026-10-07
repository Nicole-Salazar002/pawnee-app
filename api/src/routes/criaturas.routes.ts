/**
 * routes/criaturas.routes.ts
 * ------------------------------
 * Define las rutas de /api/criaturas, incluida la ruta anidada.
 */

import { Router } from "express";
import * as criaturasController from "../controllers/criaturas.controller";

export const criaturasRouter = Router();

criaturasRouter.get("/", criaturasController.listar);
criaturasRouter.get("/:id", criaturasController.obtenerPorId);
criaturasRouter.get("/:id/avistamientos", criaturasController.listarAvistamientosDeCriatura);
criaturasRouter.post("/", criaturasController.crear);
criaturasRouter.put("/:id", criaturasController.actualizar);
criaturasRouter.delete("/:id", criaturasController.eliminar);
