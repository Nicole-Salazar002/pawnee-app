/**
 * api/criaturasApi.ts
 * -----------------------
 * ÚNICO archivo que sabe cómo hablar con /api/criaturas.
 */

import { Criatura, CriaturaFormulario, TipoCriatura } from "../tipos";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const BASE = `${API_URL}/api/criaturas`;

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

export async function obtenerCriaturas(tipo?: TipoCriatura): Promise<Criatura[]> {
  const url = tipo ? `${BASE}?tipo=${encodeURIComponent(tipo)}` : BASE;
  const respuesta = await fetch(url);
  const datos = await manejarRespuesta<{ criaturas: Criatura[] }>(respuesta);
  return datos.criaturas;
}

export async function obtenerCriaturaPorId(id: string): Promise<Criatura> {
  const respuesta = await fetch(`${BASE}/${id}`);
  const datos = await manejarRespuesta<{ criatura: Criatura }>(respuesta);
  return datos.criatura;
}

export async function crearCriatura(datos: CriaturaFormulario): Promise<Criatura> {
  const respuesta = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  const resultado = await manejarRespuesta<{ criatura: Criatura }>(respuesta);
  return resultado.criatura;
}

export async function actualizarCriatura(id: string, datos: CriaturaFormulario): Promise<Criatura> {
  const respuesta = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  const resultado = await manejarRespuesta<{ criatura: Criatura }>(respuesta);
  return resultado.criatura;
}

export async function eliminarCriatura(id: string): Promise<void> {
  const respuesta = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  await manejarRespuesta<void>(respuesta);
}
