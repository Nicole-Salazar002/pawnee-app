/**
 * api/avistamientosApi.ts
 * ---------------------------
 * ÚNICO archivo que sabe cómo hablar con /api/avistamientos y con la
 * ruta anidada /api/criaturas/:id/avistamientos.
 */

import { Avistamiento, AvistamientoFormulario } from "../tipos";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const BASE_AVISTAMIENTOS = `${API_URL}/api/avistamientos`;
const BASE_CRIATURAS = `${API_URL}/api/criaturas`;

async function manejarRespuesta<T>(respuesta: Response): Promise<T> {
  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}));
    throw new Error(cuerpo.error ?? `Error HTTP ${respuesta.status}`);
  }
  if (respuesta.status === 204) {
    return undefined as T;
  }
  return respuesta.json();
}

export async function obtenerAvistamientos(): Promise<Avistamiento[]> {
  const respuesta = await fetch(BASE_AVISTAMIENTOS);
  const datos = await manejarRespuesta<{ avistamientos: Avistamiento[] }>(respuesta);
  return datos.avistamientos;
}

export async function obtenerAvistamientosDeCriatura(criaturaId: string): Promise<Avistamiento[]> {
  const respuesta = await fetch(`${BASE_CRIATURAS}/${criaturaId}/avistamientos`);
  const datos = await manejarRespuesta<{ avistamientos: Avistamiento[] }>(respuesta);
  return datos.avistamientos;
}

export async function crearAvistamiento(datos: AvistamientoFormulario): Promise<Avistamiento> {
  const respuesta = await fetch(BASE_AVISTAMIENTOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  const resultado = await manejarRespuesta<{ avistamiento: Avistamiento }>(respuesta);
  return resultado.avistamiento;
}

export async function eliminarAvistamiento(id: string): Promise<void> {
  const respuesta = await fetch(`${BASE_AVISTAMIENTOS}/${id}`, { method: "DELETE" });
  await manejarRespuesta<void>(respuesta);
}
