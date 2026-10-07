/**
 * controllers/avistamientos.controller.ts
 * -------------------------------------------
 * Este controlador NO sabe nada de populate() ni de validar
 * referencias — esa lógica vive en el servicio.
 */

import { Request, Response, NextFunction } from "express";
import * as avistamientosService from "../services/avistamientos.service";

export async function listar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const criaturaId = req.query.criaturaId as string | undefined;
    const avistamientos = await avistamientosService.listarAvistamientos(criaturaId);
    res.json({ total: avistamientos.length, avistamientos, requestId: req.id });
  } catch (error) {
    next(error);
  }
}

export async function obtenerPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const avistamiento = await avistamientosService.buscarAvistamientoPorId(req.params.id);
    res.json({ avistamiento, requestId: req.id });
  } catch (error) {
    next(error);
  }
}

export async function crear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const avistamiento = await avistamientosService.crearAvistamiento(req.body);
    res.status(201).json({ avistamiento, requestId: req.id });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const avistamiento = await avistamientosService.actualizarAvistamiento(req.params.id, req.body);
    res.json({ avistamiento, requestId: req.id });
  } catch (error) {
    next(error);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await avistamientosService.eliminarAvistamiento(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
