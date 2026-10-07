/**
 * services/criaturas.service.ts
 * ---------------------------------
 * CRUD sobre el modelo Criatura. Mismo patrón que la Semana 4, pero
 * ahora cada función habla con MongoDB real a través de Mongoose.
 */

import { Criatura, ICriatura, TipoCriatura } from "../modelos/Criatura.model";
import { ApiError } from "../apiError";

export async function listarCriaturas(tipo?: TipoCriatura): Promise<ICriatura[]> {
  const filtro = tipo ? { tipo } : {};
  return Criatura.find(filtro).sort({ nivelPeligro: -1 });
}

export async function buscarCriaturaPorId(id: string): Promise<ICriatura> {
  const criatura = await Criatura.findById(id);
  if (!criatura) {
    throw new ApiError(404, `No existe una criatura con id ${id}`);
  }
  return criatura;
}

export async function crearCriatura(datos: Partial<ICriatura>): Promise<ICriatura> {
  return Criatura.create(datos);
}

export async function actualizarCriatura(id: string, cambios: Partial<ICriatura>): Promise<ICriatura> {
  const actualizada = await Criatura.findByIdAndUpdate(id, cambios, {
    new: true,
    runValidators: true,
  });
  if (!actualizada) {
    throw new ApiError(404, `No existe una criatura con id ${id}`);
  }
  return actualizada;
}

export async function eliminarCriatura(id: string): Promise<void> {
  const resultado = await Criatura.findByIdAndDelete(id);
  if (!resultado) {
    throw new ApiError(404, `No existe una criatura con id ${id}`);
  }
}
