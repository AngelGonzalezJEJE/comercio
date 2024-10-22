const mongoose = require('mongoose') //modulo mongoose 
const mongooseDelete = require("mongoose-delete")//modulo para habilitar hard y soft delete
const comercioSchema = new mongoose.Schema({  //definicion de esquema de usuarios
    nombre: {type: String, required:true, unique:true},// required: no puede estar vacio, unique: no puede repetirse
    cif: {type:String, required:true, unique:true},
    direccion: {type:String},
    email: {type:String},
    telefono: {type:String},
    idpagina: {type:Number},
})

comercioSchema.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model('comercio', comercioSchema) //exportacion del esquema con el nombre 'comercio'