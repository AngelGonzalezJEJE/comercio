const { handleHttpError } = require("../utils/handleError");
const { checkToken, verifyToken, tokenAnon } = require("../utils/handleJwt");
// import modelos para obtener los datos necesarios para las autorizaciones 
const { userModel } = require("../models");
const { comercioModel } = require("../models");
const { paginaWebModel } = require("../models");

// middleware de autenticación para usuarios
const authMiddleware = async (req, res, next) => {
  try {
    // Check if the authorization header exists
    if (!req.headers.authorization) {
      handleHttpError(res, "NOT_TOKEN", 401);
      return;
    }
    const token = req.headers.authorization.split(" ")[1];
    const tokenData = verifyToken(token);

    if (tokenData?._id) {
      // Registered user: Fetch user details by ID
      const user = await userModel.findById(tokenData._id);
      if (!user) {
        handleHttpError(res, "USER_NOT_FOUND", 404);
        return;
      }
      req.user = user;
    } else {
      // Anonymous user: Assign anon data from tokenData
      req.user = {
        anon: true,
        intereses: tokenData.intereses || [],
        ciudad: tokenData.ciudad || null,
        role: tokenData.role || "guest",
      };
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    handleHttpError(res, "NOT_SESSION", 401);
  }
};


// middleware que comprueba que el cif del token del comercio sea el mismo que el de la página web requerida
const authMiddlewareComercio = async (req, res, next) => {
  try {
    // verifica si existe la cabecera de autorización
    if (!req.headers.authorization) {
      handleHttpError(res, "NOT_TOKEN", 401); // maneja el error si no hay token
      return;
    }

    // obtiene el id del comercio del token
    const comercioId = await checkToken(req, res);
    const comercio = await comercioModel.findById(comercioId); // busca el comercio en la base de datos

    // verifica si se encontró el comercio
    if (!comercio) {
      handleHttpError(res, "COMERCIO_NOT_FOUND", 404); // maneja el error si no se encuentra el comercio
      return;
    }

    // asigna el comercio encontrado al objeto de solicitud para su uso posterior
    req.comercio = comercio;
    console.log(comercio)

    // verifica si hay un parámetro :id en la URL
    if (req.params.id) {
      const webId = req.params.id; // obtiene el id de la página web de los parámetros de la URL
      const paginaWeb = await paginaWebModel.findById(webId); // busca la página web en la base de datos
          // verifica si se encontró la página web
          if (!paginaWeb) {
            handleHttpError(res, "PAGINA_WEB_NOT_FOUND", 404); // maneja el error si no se encuentra la página web
            return;
          }
          // compara los CIFs del comercio y la página web
          if (comercio.cif !== paginaWeb.cif) {
            handleHttpError(res, "NOT_ALLOWED", 403); // maneja el error si los CIFs no coinciden
            return;
          }
          // si los CIFs coinciden, asigna la página web encontrada al objeto de solicitud
          req.paginaWeb = paginaWeb;
    };

    // continúa al siguiente middleware o manejador de ruta
    next();
  } catch (error) {
    console.log(error); // imprime el error en la consola
    handleHttpError(res, "ERROR"); // maneja errores generales
  }
};

module.exports = { authMiddleware, authMiddlewareComercio }; // exporta los middlewares
