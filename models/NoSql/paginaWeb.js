const mongoose = require('mongoose');
const mongooseDelete = require("mongoose-delete"); // Module for soft delete

// Define the schema for the "Comercio" model
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
    type: [String],  // Array of texts
  },
  imagenes: {
    type: [String],  // Array of image URLs or paths
    required: true,
    validate: {
      validator: (req) => {
        return true; // TODO: Create validation pattern
      },
      message: "ERROR_URL",
    }
  },
  reseñas: {
    scoring: {
      type: Number,
      min: 0,
      max: 5,
      default:0,
    },
    totalPuntuaciones: {
      type: Number
    },
    comentarios: {
      type: [String]  // Array of review texts
    },
  },
  cif: { 
    type: String,
    unique: true
  }
});



// Add plugins for soft and hard delete
paginaWebSchema.plugin(mongooseDelete, { overrideMethods: "all" });

// Export the model
module.exports = mongoose.model('PaginaWeb', paginaWebSchema);
