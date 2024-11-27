const {check} = require("express-validator")
const {validateResults} = require("../utils/handleValidators")


const validatorUserLogin = [
  check("email").exists().notEmpty(),
  check("password").exists().notEmpty(),
  (req,res,next) => {
    return validateResults(req,res,next)
  }
]

const validatorUserRegister =[
  check("nombre").exists().notEmpty(),
  check("email").exists().notEmpty(),
  check("password").exists().notEmpty(),
  check("edad").exists().notEmpty(),
  check("ciudad").exists().notEmpty(),
  check("intereses").exists().notEmpty().optional(),
  check("permiteRecibirOfertas").exists().notEmpty().optional(),
  (req,res,next) => {
    return validateResults(req,res,next)
  }
]

const validatorAuthToken = [ 
  check('token').exists().notEmpty()
]

module.exports = {validatorUserLogin,validatorUserRegister,validatorAuthToken}