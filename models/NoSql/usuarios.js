const mongoose = require('mongoose');
const mongooseDelete = require("mongoose-delete")//modulo para habilitar hard y soft delete
const Schema = mongoose.Schema;

// esquema de usuario
const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        min: 0,  // Asegurarse de que la edad no sea negativa
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    intereses: {
        type: [String],  // Un array de intereses, cada uno de ellos como string
        default: []
    },
    permiteRecibirOfertas: {
        type: Boolean,
        default: false  // Por defecto, no recibir ofertas
    },
    role: {
        type: String,
        enum: ['user', 'admin'],  // Solo puede ser "user" o "admin"
        default: 'user',  // Valor por defecto "user"
        required: true
    }
}, {
    timestamps: true  // Añade las marcas de tiempo de creación y actualización
});

// Crear el modelo de usuario a partir del esquema
usuarioSchema.plugin(mongooseDelete, {overrideMethods: "all"})
const Usuarios = mongoose.model('usuarios', usuarioSchema);
module.exports = Usuarios;
