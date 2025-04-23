const express = require("express");
const router = express.Router();
const BusinessLine = require("../models/BusinessLine");
const { createFolder } = require("../utils/googleDrive");

// Crear línea de negocio
router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;

    // Crear carpeta principal en Drive
    const carpetaDrive = await createFolder(nombre);

    // Guardar en MongoDB
    const nuevaLinea = new BusinessLine({
      nombre,
      driveFolderId: carpetaDrive,
    });

    await nuevaLinea.save();
    res.status(201).json(nuevaLinea);
  } catch (error) {
    console.error("Error creando línea de negocio:", error);
    res.status(500).json({ message: "Error al crear la línea de negocio." });
  }
});

// Obtener todas las líneas
router.get("/", async (req, res) => {
  try {
    const lineas = await BusinessLine.find().sort({ fechaCreacion: -1 });
    res.json(lineas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener líneas." });
  }
});

// Editar línea
router.put("/:id", async (req, res) => {
  try {
    const { nombre } = req.body;
    const lineaActualizada = await BusinessLine.findByIdAndUpdate(
      req.params.id,
      { nombre },
      { new: true }
    );
    res.json(lineaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al editar línea." });
  }
});

// Eliminar línea
router.delete("/:id", async (req, res) => {
  try {
    await BusinessLine.findByIdAndDelete(req.params.id);
    res.json({ message: "Línea eliminada." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar línea." });
  }
});

module.exports = router;
