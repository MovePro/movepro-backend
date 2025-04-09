const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());

// Ruta de prueba con conexión a Mongo
app.get('/', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();

    const db = client.db('moveproDB'); // Nombre provisional de tu base
    const colecciones = await db.listCollections().toArray();

    await client.close();
    res.send(`✅ Conectado a MongoDB. Colecciones: ${colecciones.map(c => c.name).join(', ') || 'ninguna aún'}`);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    res.status(500).send('Error conectando a MongoDB');
  }
});

const contratosRoutes = require('./src/routes/contratos');
app.use('/api/contratos', contratosRoutes);


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

