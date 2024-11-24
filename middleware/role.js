const {handleHttpError} = require("../utils/handleError")
const {checkToken} = require("../utils/handleJwt")

//import modelos para obtener los datos necesarios para las autorizaciones 
const {userModel} = require("../models")

//con este middleware compruebo si el usuario es admin se le de paso
//si es user, el parametro debe ser su propia id para que que se le de paso
const checkRol = (allowedRoles) => async (req, res, next) => {
  try {
    // Verify the user's ID and retrieve user information
    const userId = await checkToken(req, res);
    const user = await userModel.findById(userId);
    const queryId = req.params.id;

    if (!user) {
      handleHttpError(res, "USER_NOT_FOUND", 404);
      return;
    }

    const userRole = user.role;

    // Check if the user has a matching role or if they are the same user based on `queryId`
    const hasPermission =
      allowedRoles.includes(userRole) && (userRole === "admin" || userId === queryId);

    if (!hasPermission) {
      handleHttpError(res, "NOT_ALLOWED", 403);
      return;
    }

    next();
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_PERMISSIONSROL", 403);
  }
};

module.exports = checkRol;
