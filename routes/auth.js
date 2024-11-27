const express = require("express");
const { userLogin, userRegister,authCommerceToken } = require("../controllers/auth");
const { validatorUserLogin, validatorUserRegister, validatorAuthToken} = require("../validators/auth");
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *               permitirRecibirOfertas:
 *                  type: boolean,
 *                  default: false
 *               intereses:
 *                  type: [string] 
 *             required:
 *               - nombre
 *               - email
 *               - password
 *               - edad
 *               - ciudad
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/register', validatorUserRegister, userRegister);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/login", validatorUserLogin, userLogin);

router.post("/commerce", validatorAuthToken,authCommerceToken);

module.exports = router;
