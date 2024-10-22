const mongoose = require('mongoose');
const mongooseDelete = require("mongoose-delete")//modulo para habilitar hard y soft delete

// Definir el esquema para el modelo del comercio
const paginaWebSchema = new mongoose.Schema({
  ciudad: {
    type: String,
    required: true,
  },
  actividad: {
    type: String,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  resumen: {
    type: String
  },
  textos: {
    type: [String],  // Array de textos
  },
  imagenes: {
    type: [String],  // Array de URLs de imágenes o rutas a las fotos
    required: true,
    validate: {
      validator: (req) => {
          return true; //TODO crear patrón
      },
      message: "ERROR_URL",
    }
  },
  reseñas: {
    scoring: {
      type: Number,
      min: 0,
      max: 5,
    },
    totalPuntuaciones: {
      type: Number
    },
    comentarios: {
      type: [String]  // Array de textos de las reseñas
    }
  }
});

// Crear el modelo de Comercio a partir del esquema
paginaWebSchema.plugin(mongooseDelete, {overrideMethods: "all"})//hard y soft delete
module.exports = mongoose.model('paginaWeb', paginaWebSchema);

