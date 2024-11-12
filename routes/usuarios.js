const express = require("express");
const {
  getUsuario,
  getUsuarios,
  actualizarUsuario,
  deleteUsuario,
  crearUsuario
} = require("../controllers/usuarios");

const {
  validatorActualizarUsuario,
  validatorCrearUsuario,
  validatorDeleteUsuario,
  validatorGetUsuario
} = require("../validators/users");

const { authMiddleware } = require("../middleware/session");
const checkRol  = require("../middleware/role");
const router = express.Router();

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Get a list of all users (only an admin can do this)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []  # Assuming authentication is required
 *     responses:
 *       200:
 *         description: A list of all users
 *       403:
 *         description: Forbidden, authorization required
 */
router.get("/", authMiddleware, getUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 edad:
 *                   type: number
 *                 ciudad:
 *                   type: string
 *                 intereses:
 *                   type: array
 *                   items:
 *                     type: string
 *                 permiteRecibirOfertas:
 *                   type: boolean
 *                 role:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get("/:id", validatorGetUsuario, getUsuario);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Create a new user (use this for creating an admin user)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               edad:
 *                 type: number
 *               ciudad:
 *                 type: string
 *               intereses:
 *                 type: array
 *                 items:
 *                   type: string
 *               role:
 *                 type: string
 *                 enum: ['user', 'admin']  # Must be either 'user' or 'admin'
 *             required:
 *               - nombre
 *               - email
 *               - password
 *               - edad
 *               - ciudad
 *               - role
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", validatorCrearUsuario, crearUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Update an existing user by ID (user roles con only update themselves)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               edad:
 *                 type: number
 *               ciudad:
 *                 type: string
 *               intereses:
 *                 type: array
 *                 items:
 *                   type: string
 *               role:
 *                 type: string
 *                 enum: ['user', 'admin']
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: User not found
 */
router.put("/:id", validatorActualizarUsuario, actualizarUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Delete a user by ID (user roles can olny delete themselves)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *     security:
 *       - bearerAuth: []  # Assuming authentication is required
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", validatorDeleteUsuario, authMiddleware, checkRol, deleteUsuario);

module.exports = router;