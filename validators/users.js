const {check} = require("express-validator")
const {validateResults} = require("../utils/handleValidators")

const validatorGetUsuario = [
  check("id").exists().notEmpty(),
  (req,res,next) => validateResults(req,res,next)
]

const validatorCrearUsuario =[
  check("nombre").exists().notEmpty(),
  check("email").exists().notEmpty(),
  check("password").exists().notEmpty(),
  check("edad").exists().notEmpty(),
  check("ciudad").exists().notEmpty(),
  check("intereses").exists().notEmpty().optional(),
  check("role").exists().notEmpty(),
  (req,res,next) => validateResults(req,res,next)
]

const validatorActualizarUsuario =[
  check("nombre").exists().notEmpty().optional(),
  check("email").exists().notEmpty().optional(),
  check("password").exists().notEmpty().optional(),
  check("edad").exists().notEmpty().optional(),
  check("ciudad").exists().notEmpty().optional(),
  check("intereses").exists().notEmpty().optional(),
  (req,res,next) => validateResults(req,res,next)
]

const validatorDeleteUsuario = [
  check("id").exists().notEmpty(),
  (req,res,next) => validateResults(req,res,next)
]

module.exports = {validatorActualizarUsuario,validatorCrearUsuario,validatorDeleteUsuario,validatorGetUsuario}
