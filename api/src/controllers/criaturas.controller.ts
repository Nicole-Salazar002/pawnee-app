/**
 * controllers/criaturas.controller.ts
 * ---------------------------------------
 * Traduce HTTP <-> servicio. Igual patrón que la Semana 4.
 */

import { Request, Response, NextFunction } from "express";
import * as criaturasService from "../services/criaturas.service";
import * as avistamientosService from "../services/avistamientos.service";
import { TipoCriatura } from "../modelos/Criatura.model";

export async function listar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tipo = req.query.tipo as TipoCriatura | undefined;
    const criaturas = await criaturasService.listarCriaturas(tipo);
    res.json({ total: criaturas.length, criaturas, requestId: req.id });
  } catch (error) {
    next(error);
  }
}

export async function obtenerPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const criatura = await criaturasService.buscarCriaturaPorId(req.params.id);
    res.json({ criatura, requestId: req.id });
  } catch (error) {
    next(error);
  }
}

export async function crear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const criatura = await criaturasService.crearCriatura(req.body);
    res.status(201).json({ criatura, requestId: req.id });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const criatura = await criaturasService.actualizarCriatura(req.params.id, req.body);
    res.json({ criatura, requestId: req.id });
  } catch (error) {
    next(error);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await criaturasService.eliminarCriatura(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Ruta anidada: GET /api/criaturas/:id/avistamientos
export async function listarAvistamientosDeCriatura(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const avistamientos = await avistamientosService.listarAvistamientosDeCriatura(req.params.id);
    res.json({ total: avistamientos.length, avistamientos, requestId: req.id });
  } catch (error) {
    next(error);
  }
}
