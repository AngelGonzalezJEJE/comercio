const express = require('express');
const router = express.Router();
const controllerCom = require("../controllers/comercio");
const {
  validatorActualizarComercioPorCif,
  validatorComercioPorCif,
  validatorCrearComercio,
  validatorBorrarComercioPorCif
} = require("../validators/comercio");
const {authMiddleware,authMiddlewareComercio} = require("../middleware/session");
const { checkRol } = require("../middleware/role");

// Define the routes for CRUD operations

/**
 * @swagger
 * /api/comercio:
 *   get:
 *     summary: Get all commerces (only an admin can do this)
 *     tags: [Comercio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of commerces
 *                   
 *       403:
 *         description: Forbidden, user does not have permission
 */
router.get('/', authMiddleware, checkRol, controllerCom.getComercios);


/**
 * @swagger
 * /api/comercio/{cif}:
 *   get:
 *     summary: Get a commerce by CIF
 *     tags: [Comercio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cif
 *         in: path
 *         required: true
 *         description: CIF of the commerce to retrieve
 *     responses:
 *       200:
 *         description: Details of the commerce
 *       404:
 *         description: Commerce not found
 *       403:
 *         description: Forbidden, user does not have permission
 */
router.get('/:cif', validatorComercioPorCif, authMiddleware,checkRol, controllerCom.comercioPorCif);

/**
 * @swagger
 * /api/comercio:
 *   post:
 *     summary: Create a new commerce
 *     tags: [Comercio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               cif:
 *                 type: string
 *               direccion:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               idpagina:
 *                 type: number
 *             required:
 *               - nombre
 *               - cif
 *               
 *     responses:
 *       201:
 *         description: Commerce created successfully
 *       400:
 *         description: Invalid input data
 *       403:
 *         description: Forbidden, user does not have permission
 */
router.post('/', validatorCrearComercio, authMiddleware,checkRol, controllerCom.crearComercio);

/**
 * @swagger
 * /api/comercio/{cif}:
 *   delete:
 *     summary: Delete a commerce by CIF
 *     tags: [Comercio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cif
 *         in: path
 *         required: true
 *         description: CIF of the commerce to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Commerce deleted successfully
 *       404:
 *         description: Commerce not found
 *       403:
 *         description: Forbidden, user does not have permission
 */
router.delete('/:cif', validatorBorrarComercioPorCif, authMiddleware,checkRol, controllerCom.borrarComercio);

/**
 * @swagger
 * /api/comercio/{cif}:
 *   put:
 *     summary: Update a commerce by CIF
 *     tags: [Comercio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cif
 *         in: path
 *         required: true
 *         description: CIF of the commerce to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               idpagina:
 *                 type: number
 *     responses:
 *       200:
 *         description: Commerce updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Commerce not found
 *       403:
 *         description: Forbidden, user does not have permission
 */
router.put('/:cif', validatorActualizarComercioPorCif, authMiddleware,checkRol, controllerCom.actualizarComercioCif);


/**
 * @swagger
 * /api/comercio/interesados:
 *   get:
 *     summary: Get emails of interested users for a specific page
 *     tags: [Comercio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of interested users' emails
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: user@example.com
 *       403:
 *         description: Forbidden, user does not have permission
 *       404:
 *         description: Page not found
 */
router.get('/interesados', authMiddlewareComercio, controllerCom.getEmailInteresados);


module.exports = router; // Export to be used in app.js
