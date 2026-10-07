/**
 * tipos.ts
 * --------
 * Misma forma de datos que el backend de Express + Mongoose (Semana 6).
 */

export type TipoCriatura = "mitica" | "elemental" | "mecanica" | "espectral";
export type EstadoInvestigacion = "activa" | "en_investigacion" | "descartada";

export const TIPOS_CRIATURA: TipoCriatura[] = ["mitica", "elemental", "mecanica", "espectral"];
export const ESTADOS_INVESTIGACION: EstadoInvestigacion[] = ["activa", "en_investigacion", "descartada"];

export interface Criatura {
  _id: string;
  nombre: string;
  tipo: TipoCriatura;
  habilidades: string[];
  nivelPeligro: number;
  estado: EstadoInvestigacion;
  createdAt: string;
  updatedAt: string;
}

export type CriaturaFormulario = Omit<Criatura, "_id" | "createdAt" | "updatedAt">;

export interface Avistamiento {
  _id: string;
  criatura: Criatura; // ya viene populado desde el backend
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvistamientoFormulario {
  criatura: string; // _id de la criatura elegida
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}
