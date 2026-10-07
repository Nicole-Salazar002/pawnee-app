/**
 * modelos/Avistamiento.model.ts
 * ---------------------------------
 * El mismo modelo de la Clase 1, reutilizado sin cambios. `criatura`
 * sigue siendo una REFERENCIA (ObjectId + ref), no un objeto embebido.
 */

import { Schema, model, Document, Types } from "mongoose";

export interface IAvistamiento extends Document {
  criatura: Types.ObjectId;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AvistamientoSchema = new Schema<IAvistamiento>(
  {
    criatura: {
      type: Schema.Types.ObjectId,
      ref: "Criatura",
      required: [true, "El avistamiento debe estar vinculado a una criatura"],
    },
    testigo: { type: String, required: [true, "El nombre del testigo es obligatorio"], trim: true },
    ubicacion: { type: String, required: [true, "La ubicación del avistamiento es obligatoria"], trim: true },
    descripcion: { type: String, required: false },
    fecha: { type: Date, required: [true, "La fecha del avistamiento es obligatoria"] },
  },
  { timestamps: true }
);

export const Avistamiento = model<IAvistamiento>("Avistamiento", AvistamientoSchema);
