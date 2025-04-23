const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contractRoutes = require("./routes/contracts.routes");
const activityRoutes = require("./routes/activities.routes");
const activityFormsRoutes = require("./routes/activity.routes");



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/contracts", contractRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/activities", activityFormsRoutes);


// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error conectando a MongoDB:", error.message);
  });

