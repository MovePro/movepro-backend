const mongoose = require("mongoose");

const businessLineSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  activo: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("BusinessLine", businessLineSchema);
