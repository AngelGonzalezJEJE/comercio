const express = require('express')
const router = express.Router()
const controllerCom = require("../controllers/comercio") //para se llamar las funciones creadas en controllers
const {validatorActualizarComercioPorCif,validatorComercioPorCif,validatorCrearComercio,validatorBorrarComercioPorCif} = require("../validators/comercio")

//definicion de las rutas para las operaciones CRUD

router.get('/',controllerCom.getComercios); //ruta para  obtener todos los registros
router.get('/:cif',validatorComercioPorCif, controllerCom.comercioPorCif)//ruta para obtener un registro por su CIF
router.post('/',validatorCrearComercio, controllerCom.crearComercio)//ruta para crear un comercio 
router.delete('/:cif',validatorBorrarComercioPorCif,controllerCom.borrarComercio)//ruta para borrar un comercio por su CIF
router.put('/:cif',validatorActualizarComercioPorCif,controllerCom.actualizarComercioCif)//ruta para actualizar un comercio por su CIF

module.exports= router //se exporta para usarse en app.js