const express = require('express');
const router = express.Router();
const {uploadMiddleware,uploadMiddlewareMemory} = require("../utils/handleStorage");
const { authMiddlewareComercio, authMiddleware } = require("../middleware/session");
const checkRol  = require("../middleware/role");
const pgwController = require("../controllers/paginaWeb");
const {
  validatorBorrarPaginaWeb,
  validatorModificarPaginaWeb,
  validatorcrearPaginaWeb,
  validatorpaginaWebPorId,
  validatorCrearImagen
} = require("../validators/paginaWeb");
/**
 * @swagger
 * /api/paginaWeb:
 *   get:
 *     summary: Retrieve a list of web pages.
 *     description: Fetches a list of web pages filtered by optional query parameters such as `ciudad` and `actividad`, and sorted by scoring if specified.
 *     tags:
 *       - PaginaWeb
 *     parameters:
 *       - in: query
 *         name: ciudad
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by city.
 *       - in: query
 *         name: actividad
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by activity.
 *       - in: query
 *         name: scoring
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         required: false
 *         description: If `true`, sorts the results by scoring in descending order.
 *     responses:
 *       200:
 *         description: A JSON array of web pages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the web page.
 *                   ciudad:
 *                     type: string
 *                     description: The city of the web page.
 *                   actividad:
 *                     type: string
 *                     description: The activity related to the web page.
 *                   reseñas:
 *                     type: object
 *                     properties:
 *                       scoring:
 *                         type: number
 *                         description: The scoring of the web page.
 *       500:
 *         description: Internal server error.
 */
router.get("/" , pgwController.getAllWeb)


/**
 * @swagger
 * /api/paginaWeb/{cif}:
 *   get:
 *     summary: Get a specific web page by ID
 *     tags: [PaginaWeb]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The page ID
 *     responses:
 *       200:
 *         description: Web page details
 *       403:
 *         description: Forbidden, user does not have permission
 */
router.get('/:cif', validatorpaginaWebPorId, pgwController.paginaWebPorId);

/**
 * @swagger
 * /api/paginaWeb:
 *   post:
 *     summary: Create a new web page
 *     tags: [PaginaWeb]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:  # Added schema here
 *             type: object
 *             properties:
 *               ciudad:
 *                 type: string
 *               actividad:
 *                 type: string
 *               titulo:
 *                 type: string
 *               resumen:
 *                 type: string
 *               textos:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - nombre
 *               - actividad
 *               - titulo
 *     responses:
 *       201:
 *         description: Page created successfully
 *       403:
 *         description: Forbidden, user does not have permission
 */
router.post('/', validatorcrearPaginaWeb, authMiddlewareComercio, pgwController.crearPaginaWeb);

/**
 * @swagger
 * /api/paginaWeb/{id}:
 *   delete:
 *     summary: Delete a web page by ID
 *     tags: [PaginaWeb]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The page ID to delete
 *     responses:
 *       200:
 *         description: Page deleted successfully
 *       403:
 *         description: Forbidden, user does not have permission
 */
router.delete('/:cif', validatorBorrarPaginaWeb, authMiddlewareComercio, pgwController.borrarPaginaWeb);

/**
 * @swagger
 * /api/paginaWeb/{cif}:
 *   put:
 *     summary: Update a web page by ID
 *     tags: [PaginaWeb]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The page ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ciudad:
 *                 type: string
 *               actividad:
 *                 type: string
 *               titulo:
 *                 type: string
 *               resumen:
 *                 type: string
 *               textos:
 *                 type: array
 *                 items:
 *                   type: string
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 
 *     responses:
 *       200:
 *         description: Page updated successfully
 *       403:
 *         description: Forbidden, user does not have permission
 */

router.put('/:cif', validatorModificarPaginaWeb, authMiddlewareComercio, pgwController.modificarPaginaWeb);

/**
 * @swagger
 * /api/paginaWeb/img:
 *   patch:
 *     summary: Upload an image for a web page
 *     tags: [PaginaWeb]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               textos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional array of text descriptions to add to the page
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileData:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     url:
 *                       type: string
 *                 textos:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: No file uploaded
 *       404:
 *         description: Page not found
 *       403:
 *         description: Forbidden, user does not have permission
 *       500:
 *         description: Internal server error
 */
router.patch('/img', validatorCrearImagen, authMiddlewareComercio, uploadMiddleware.single('image'), pgwController.crearImagen);
//router.patch('/logo', validatorCrearImagen, authMiddlewareComercio, uploadMiddlewareMemory.single('image'), pgwController.updateImage);


module.exports = router;
