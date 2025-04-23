const mongoose = require("mongoose");

const formularioSchema = new mongoose.Schema({
  linea: { type: String }, // solo aplica para 1.2
  nombre: { type: String, required: true },
  url: { type: String, required: true },
  fechaSubida: { type: Date, default: Date.now }
});

const activitySchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  formulario1_1: formularioSchema,
  formularios1_2: [formularioSchema],
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);
