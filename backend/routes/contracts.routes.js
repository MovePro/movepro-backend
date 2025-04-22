const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Esquema temporal para los contratos
const contractSchema = new mongoose.Schema({
  concesionario: String,
  tipoConsultoria: String,
  lineasNegocio: [String],
  sedesVN: [String],
  sedesPV: [String],
  sedesVO: [String],
  fechaCreacion: { type: Date, default: Date.now },
  consecutivo: Number,
});

const Contract = mongoose.model("Contract", contractSchema);

// Ruta GET básica (sigue funcionando para test)
router.get("/", (req, res) => {
  res.send("Ruta de contratos funcionando");
});

// Ruta POST para crear contrato
router.post("/", async (req, res) => {
  try {
    const {
      concesionario,
      tipoConsultoria,
      lineasNegocio,
      sedesVN,
      sedesPV,
      sedesVO,
    } = req.body;

    // Obtener el número de contrato más alto actual
    const ultimoContrato = await Contract.findOne().sort({ consecutivo: -1 });
    const nuevoConsecutivo = ultimoContrato ? ultimoContrato.consecutivo + 1 : 1;

    // Crear nuevo contrato
    const nuevoContrato = new Contract({
      concesionario,
      tipoConsultoria,
      lineasNegocio,
      sedesVN,
      sedesPV,
      sedesVO,
      consecutivo: nuevoConsecutivo,
    });

    await nuevoContrato.save();

    res.status(201).json({ message: "Contrato guardado exitosamente." });
  } catch (error) {
    console.error("Error al guardar el contrato:", error);
    res.status(500).json({ message: "Error al guardar el contrato." });
  }
});

module.exports = router;
