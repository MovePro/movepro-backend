const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

function generarClaveAleatoria(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let clave = '';
  for (let i = 0; i < length; i++) {
    clave += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return clave;
}

router.post('/', async (req, res) => {
  const { nombreConcesionario, fechaFirma, actividades } = req.body;

  if (!nombreConcesionario || !fechaFirma || !actividades) {
    return res.status(400).json({ error: 'Faltan datos del contrato.' });
  }

  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db('moveproDB');
    const contratos = db.collection('contratos');

    const contrato = {
      nombreConcesionario,
      fechaFirma,
      actividades: actividades.map(act => ({
        nombre: act.nombre,
        sedes: act.sedes.map(sede => ({
          nombre: sede,
          clave_1_1: generarClaveAleatoria(),
          clave_1_2: generarClaveAleatoria(16),
        }))
      })),
      creadoEn: new Date()
    };

    const resultado = await contratos.insertOne(contrato);
    await client.close();

    res.status(201).json({ mensaje: 'Contrato creado exitosamente.', contrato });
  } catch (error) {
    console.error('Error al crear contrato:', error);
    res.status(500).json({ error: 'Error interno al guardar el contrato.' });
  }
});

module.exports = router;

// Obtener todos los contratos
router.get('/', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db('moveproDB');
    const contratos = await db.collection('contratos').find().toArray();
    await client.close();

    res.status(200).json(contratos);
  } catch (error) {
    console.error('Error al obtener contratos:', error);
    res.status(500).json({ error: 'Error interno al consultar contratos.' });
  }
});

