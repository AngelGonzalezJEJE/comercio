const express = require('express')
const router = express.Router()
const uploadMiddleware = require("../utils/handleStorage")//para subir los archivos
const pgwController = require("../controllers/paginaWeb") //para se llamar las funciones creadas en controllers
const {validatorBorrarPaginaWeb,validatorModificarPaginaWeb,validatorcrearPaginaWeb,validatorpaginaWebPorId, validatorCrearImagen} = require("../validators/paginaWeb")

//definicion de las rutas para las operaciones CRUD
router.get('/:id',validatorpaginaWebPorId ,pgwController.paginaWebPorId )//ruta para pagina web por id
router.post('/', validatorcrearPaginaWeb,pgwController.crearPaginaWeb)//ruta para crear una pagina web
router.delete('/:id',validatorBorrarPaginaWeb,pgwController.borrarPaginaWeb)//ruta para borrar una pagina web/ ?physical=true para Hard Delete
router.put('/:id',validatorModificarPaginaWeb,pgwController.modificarPaginaWeb)//ruta para modificar pagina web por su id
router.put('/img/:id',validatorCrearImagen,uploadMiddleware.single('image'),pgwController.crearImagen)//ruta para subir una imagen

module.exports = router //se exporta para usarse en app.js