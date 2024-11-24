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
    type: String,
  },
  textos: {
    type: [String],  // Array of texts
  },
  imagenes: {
    type: [String],  // Array of image URLs or paths
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
      default: 0,
    },
    totalPuntuaciones: {
      type: Number,
      default: 0,
    },
    comentarios: [{
      comentario: { type: String, required: true },  // The actual comment text
      userName: { type: String, required: true }, // Name of the user who left the comment
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Optional: Reference to the user
    }],
    ratings: [{
      rating: { type: Number, min: 1, max: 5 },
      userName: { type: String, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // User who rated
    }],
  },
  cif: { 
    type: String,
    unique: true,
  },
});

// Method to calculate average score based on ratings
paginaWebSchema.methods.calculateScoring = function () {
  if (this.reseñas.ratings && this.reseñas.ratings.length > 0) {
    // total of rating to the page
    const totalScore = this.reseñas.ratings.reduce((acc, rating) => acc + rating.rating, 0); // Sum of ratings
    
    //caculate avg rating
    this.reseñas.scoring = (totalScore / this.reseñas.ratings.length).toFixed(1); // Rounded to 1 decimal
    this.reseñas.totalPuntuaciones = this.reseñas.ratings.length; // Total count of ratings
  } else {
    //default 
    this.reseñas.scoring = 0; 
    this.reseñas.totalPuntuaciones = 0; 
  }

  // this way we ensure that scoring and puntuaciones are numbers if any type error
  this.reseñas.scoring = parseFloat(this.reseñas.scoring);
  this.reseñas.totalPuntuaciones = parseInt(this.reseñas.totalPuntuaciones, 10);
};

paginaWebSchema.pre('save', function (next) {
  this.calculateScoring();
  next();
});

// Add plugins for soft and hard delete
paginaWebSchema.plugin(mongooseDelete, { overrideMethods: "all" });

// Export the model
module.exports = mongoose.model('PaginaWeb', paginaWebSchema);

