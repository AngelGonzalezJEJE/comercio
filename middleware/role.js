const {handleHttpError} = require("../utils/handleError")
const {checkToken} = require("../utils/handleJwt")

//import modelos para obtener los datos necesarios para las autorizaciones 
const {userModel} = require("../models")

//con este middleware compruebo si el usuario es admin se le de paso
//si es user, el parametro debe ser su propia id para que que se le de paso
const checkRol = async (req, res, next) => { // Doble argumento
  try {

    if (req.user.anon === true){
      console.log(req.user)
      userRol = req.user.role

    }
    else{
      const userId = await  checkToken(req,res)
      const user = await userModel.findById(userId)
      const queryId = req.params.id

      const userRol = user.role
      const checkValueRol = userRol === "admin" || (userRol ==="user" && userId === queryId);
      if (!checkValueRol) {
          handleHttpError(res, "NOT_ALLOWED", 403)
          return
      }
    }
      next()
  } catch (err) {
    console.log(err)
      handleHttpError(res, "ERROR_PERMISSIONSROL", 403)
  }
};

module.exports= checkRol