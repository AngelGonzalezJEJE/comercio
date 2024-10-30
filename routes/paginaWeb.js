const express = require('express');
const router = express.Router();
const uploadMiddleware = require("../utils/handleStorage");
const { authMiddlewareComercio, authMiddleware } = require("../middleware/session");
const { checkRol } = require("../middleware/role");
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
 * /api/paginaWeb/{id}:
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
router.get('/:id', validatorpaginaWebPorId, authMiddleware, checkRol, pgwController.paginaWebPorId);

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
router.delete('/:id', validatorBorrarPaginaWeb, authMiddlewareComercio, pgwController.borrarPaginaWeb);

/**
 * @swagger
 * /api/paginaWeb/{id}:
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

router.put('/:id', validatorModificarPaginaWeb, authMiddlewareComercio, pgwController.modificarPaginaWeb);

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


module.exports = router;
