const {check} = require("express-validator")
const {validateResults} = require("../utils/handleValidators")

//validador de get oagina web por id, valida el id de mongo db
const validatorpaginaWebPorId = [
  check("id").exists().notEmpty().isMongoId(),
  (req, res, next) => validateResults(req, res, next)
];


//validador de de crear pagina web, ciudad actividad y titulo son obligatorion en la creacion, se validan todos los campos
const validatorcrearPaginaWeb = [
    check('ciudad').exists().notEmpty(),
    check("actividad").exists().notEmpty(),
    check('titulo').exists().notEmpty(),
    check('resumen').exists().notEmpty().optional(),
    check('textos').exists().notEmpty().optional(),
    check('imagenes').exists().notEmpty().optional(),
    check('reseñas').exists().notEmpty().optional(),
    check('reseñas.scoring').exists().notEmpty().optional(),
    check('reseñas.totalPuntuaciones').exists().notEmpty().optional(),
    check('reseñas.comentarios').exists().notEmpty().optional(),
    (req, res, next) => validateResults(req, res, next)
];

//valida todos los campos requeridos por la solicitud, por lo que todos son opcionales
const validatorModificarPaginaWeb = [
  check('ciudad').exists().notEmpty().optional(),
  check("actividad").exists().notEmpty().optional(),
  check('titulo').exists().notEmpty().optional(),
  check('resumen').exists().notEmpty().optional(),
  check('textos').exists().notEmpty().optional(),
  check('imagenes').exists().notEmpty().optional(),
  check('reseñas').exists().notEmpty().optional(),
  check('reseñas.scoring').exists().notEmpty().optional(),
  check('reseñas.totalPuntuaciones').exists().notEmpty().optional(),
  check('reseñas.comentarios').exists().notEmpty().optional(),
(req, res, next) => validateResults(req, res, next)
];

//valida id
const validatorBorrarPaginaWeb =[
  check("id").exists().notEmpty().isMongoId(),
  (req,res,next) => validateResults(req,res,next)
];

//valida id
const validatorCrearImagen = [
  check("id").exists().notEmpty().isMongoId(),
  (req, res, next) => validateResults(req, res, next)
]


module.exports = {validatorBorrarPaginaWeb,validatorModificarPaginaWeb,validatorcrearPaginaWeb,validatorpaginaWebPorId,validatorCrearImagen}
