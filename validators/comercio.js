const {check} = require("express-validator")
const {validateResults} = require("../utils/handleValidators")

const validatorComercioPorCif = [
  check("cif").exists().notEmpty(),
  (req, res, next) => validateResults(req, res, next)
];

const validatorCrearComercio = [
    check('nombre').exists().notEmpty(),
    check("cif").exists().notEmpty(),
    check('direccion').exists().notEmpty(),
    check('email').exists().notEmpty(),
    check('telefono').exists().notEmpty().optional(),
  (req, res, next) => validateResults(req, res, next)
];

const validatorActualizarComercioPorCif = [
  check('nombre').exists().notEmpty().optional(),
  check('direccion').exists().notEmpty().optional(),
  check('email').exists().notEmpty().optional(),
  check('telefono').exists().notEmpty().optional(),
(req, res, next) => validateResults(req, res, next)
];

const validatorBorrarComercioPorCif =[
  check("cif").exists().notEmpty(),
  (req,res,next) => validateResults(req,res,next)
];

const validatorSendEmail = [
  check("subject").exists().notEmpty(),
  check("text").exists().notEmpty(),
  check("to").exists().notEmpty(),
  (req, res, next) => validateResults(req,res,next)
];

module.exports = {validatorActualizarComercioPorCif,validatorComercioPorCif,validatorCrearComercio,validatorBorrarComercioPorCif, validatorSendEmail}
