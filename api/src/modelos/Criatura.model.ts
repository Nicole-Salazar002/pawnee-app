/**
 * modelos/Criatura.model.ts
 * ----------------------------
 * El mismo modelo diseñado en la Semana 6 · Clase 1, reutilizado sin
 * cambios: la API de esta clase no redefine el esquema, lo CONSUME.
 */

import { Schema, model, Document } from "mongoose";

export type TipoCriatura = "mitica" | "elemental" | "mecanica" | "espectral";
export type EstadoInvestigacion = "activa" | "en_investigacion" | "descartada";

export interface ICriatura extends Document {
  nombre: string;
  tipo: TipoCriatura;
  habilidades: string[];
  nivelPeligro: number;
  estado: EstadoInvestigacion;
  createdAt: Date;
  updatedAt: Date;
}

const CriaturaSchema = new Schema<ICriatura>(
  {
    nombre: { type: String, required: [true, "El nombre de la criatura es obligatorio"], trim: true },
    tipo: {
      type: String,
      enum: {
        values: ["mitica", "elemental", "mecanica", "espectral"],
        message: "{VALUE} no es un tipo de criatura válido",
      },
      required: true,
    },
    habilidades: { type: [String], default: [] },
    nivelPeligro: {
      type: Number,
      required: true,
      min: [1, "El nivel de peligro mínimo es 1"],
      max: [10, "El nivel de peligro máximo es 10"],
    },
    estado: {
      type: String,
      enum: ["activa", "en_investigacion", "descartada"],
      default: "activa",
    },
  },
  { timestamps: true }
);

export const Criatura = model<ICriatura>("Criatura", CriaturaSchema);
