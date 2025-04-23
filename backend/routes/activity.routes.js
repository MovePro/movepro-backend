const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Activity = require("../models/Activity");
const { uploadFile, createFolder } = require("../utils/googleDrive");

const upload = multer({ dest: "uploads/" });

// Ruta para subir 1.1 general de una actividad
router.post("/upload-1-1/:actividadId", upload.single("formulario"), async (req, res) => {
  try {
    const actividad = await Activity.findById(req.params.actividadId);
    if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });

    const localPath = req.file.path;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // Crear carpeta de actividad si no tiene ID aún
    if (!actividad.driveFolderId) {
      const folderId = await createFolder(actividad.nombre);
      actividad.driveFolderId = folderId;
    }

    // Crear subcarpeta 1.1 si no existe
    if (!actividad.folder1_1) {
      actividad.folder1_1 = await createFolder("1.1", actividad.driveFolderId);
    }

    const driveFile = await uploadFile({
      filePath: localPath,
      nombre: fileName,
      mimeType,
      parentFolderId: actividad.folder1_1,
    });

    // Limpiar archivo local
    fs.unlinkSync(localPath);

    // Actualizar en Mongo
    actividad.formulario1_1 = {
      nombre: fileName,
      url: driveFile.webViewLink,
      fechaSubida: new Date(),
    };

    await actividad.save();
    res.json(actividad.formulario1_1);
  } catch (error) {
    console.error("Error subiendo formulario 1.1:", error);
    res.status(500).json({ message: "Error al subir formulario 1.1" });
  }
});

// Ruta para subir 1.2 por línea
router.post("/upload-1-2/:actividadId", upload.single("formulario"), async (req, res) => {
  try {
    const { linea } = req.body;
    const actividad = await Activity.findById(req.params.actividadId);
    if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });

    const localPath = req.file.path;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // Crear carpeta actividad si no tiene
    if (!actividad.driveFolderId) {
      const folderId = await createFolder(actividad.nombre);
      actividad.driveFolderId = folderId;
    }

    // Crear subcarpeta 1.2 si no existe
    if (!actividad.folder1_2) {
      actividad.folder1_2 = await createFolder("1.2", actividad.driveFolderId);
    }

    // Crear subcarpeta específica para línea
    let folderLinea = actividad[`folder1_2_${linea}`];
    if (!folderLinea) {
      folderLinea = await createFolder(linea, actividad.folder1_2);
      actividad[`folder1_2_${linea}`] = folderLinea;
    }

    const driveFile = await uploadFile({
      filePath: localPath,
      nombre: fileName,
      mimeType,
      parentFolderId: folderLinea,
    });

    fs.unlinkSync(localPath);

    // Reemplazar si ya existe la línea
    const existente = actividad.formularios1_2.find(f => f.linea === linea);
    if (existente) {
      existente.nombre = fileName;
      existente.url = driveFile.webViewLink;
      existente.fechaSubida = new Date();
    } else {
      actividad.formularios1_2.push({
        linea,
        nombre: fileName,
        url: driveFile.webViewLink,
        fechaSubida: new Date(),
      });
    }

    await actividad.save();
    res.json({ message: "Formulario 1.2 subido con éxito", datos: actividad.formularios1_2 });
  } catch (error) {
    console.error("Error subiendo formulario 1.2:", error);
    res.status(500).json({ message: "Error al subir formulario 1.2" });
  }
});

// Obtener actividad con formularios
router.get("/:actividadId", async (req, res) => {
  try {
    const actividad = await Activity.findById(req.params.actividadId);
    if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });
    res.json(actividad);
  } catch (error) {
    console.error("Error obteniendo actividad:", error);
    res.status(500).json({ message: "Error al obtener datos de la actividad" });
  }
});

module.exports = router;
