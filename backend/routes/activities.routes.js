const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const { createFolder } = require("../utils/googleDrive");

// Crear actividad
router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;

    // Crear carpeta principal en Drive
    const carpetaDrive = await createFolder(nombre);
    console.log("✅ Carpeta creada en Drive:", carpetaDrive);

    // Guardar en MongoDB
    const nuevaActividad = new Activity({
      nombre,
      driveFolderId: carpetaDrive,
    });

    await nuevaActividad.save();
    res.status(201).json(nuevaActividad);
  } catch (error) {
    console.error("Error creando actividad:", error);
    res.status(500).json({ message: "Error al crear la actividad." });
  }
});

// Obtener todas las actividades
router.get("/", async (req, res) => {
  try {
    const actividades = await Activity.find().sort({ fechaCreacion: -1 });
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener actividades." });
  }
});

// Editar actividad
router.put("/:id", async (req, res) => {
  try {
    const { nombre } = req.body;
    const actividadActualizada = await Activity.findByIdAndUpdate(
      req.params.id,
      { nombre },
      { new: true }
    );
    res.json(actividadActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al editar actividad." });
  }
});

// Eliminar actividad
router.delete("/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Actividad eliminada." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar actividad." });
  }
});

module.exports = router;
