/**
 * services/avistamientos.service.ts
 * -------------------------------------
 * CRUD sobre el modelo Avistamiento. Cada avistamiento REFERENCIA una
 * criatura, así que hay dos reglas nuevas: (1) al crear, confirmar que
 * la criatura exista; (2) al leer, usar populate().
 */

import { Avistamiento, IAvistamiento } from "../modelos/Avistamiento.model";
import { Criatura } from "../modelos/Criatura.model";
import { ApiError } from "../apiError";

export async function listarAvistamientos(criaturaId?: string): Promise<IAvistamiento[]> {
  const filtro = criaturaId ? { criatura: criaturaId } : {};
  return Avistamiento.find(filtro).populate("criatura").sort({ fecha: -1 });
}

export async function listarAvistamientosDeCriatura(criaturaId: string): Promise<IAvistamiento[]> {
  const criatura = await Criatura.findById(criaturaId);
  if (!criatura) {
    throw new ApiError(404, `No existe una criatura con id ${criaturaId}`);
  }
  return Avistamiento.find({ criatura: criaturaId }).sort({ fecha: -1 });
}

export async function buscarAvistamientoPorId(id: string): Promise<IAvistamiento> {
  const avistamiento = await Avistamiento.findById(id).populate("criatura");
  if (!avistamiento) {
    throw new ApiError(404, `No existe un avistamiento con id ${id}`);
  }
  return avistamiento;
}

export async function crearAvistamiento(datos: Partial<IAvistamiento>): Promise<IAvistamiento> {
  // Confirmamos que la criatura referenciada exista ANTES de crear.
  const criaturaExiste = await Criatura.findById(datos.criatura);
  if (!criaturaExiste) {
    throw new ApiError(404, `No existe una criatura con id ${datos.criatura}`);
  }
  return Avistamiento.create(datos);
}

export async function actualizarAvistamiento(
  id: string,
  cambios: Partial<IAvistamiento>
): Promise<IAvistamiento> {
  if (cambios.criatura) {
    const criaturaExiste = await Criatura.findById(cambios.criatura);
    if (!criaturaExiste) {
      throw new ApiError(404, `No existe una criatura con id ${cambios.criatura}`);
    }
  }

  const actualizado = await Avistamiento.findByIdAndUpdate(id, cambios, {
    new: true,
    runValidators: true,
  }).populate("criatura");

  if (!actualizado) {
    throw new ApiError(404, `No existe un avistamiento con id ${id}`);
  }
  return actualizado;
}

export async function eliminarAvistamiento(id: string): Promise<void> {
  const resultado = await Avistamiento.findByIdAndDelete(id);
  if (!resultado) {
    throw new ApiError(404, `No existe un avistamiento con id ${id}`);
  }
}
