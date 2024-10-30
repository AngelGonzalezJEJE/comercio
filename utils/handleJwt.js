const jwt = require("jsonwebtoken");
const { handleHttpError } = require("./handleError");
const JWT =  process.env.JWT_SECRET

const tokenSing = (data) => {
  const sing = jwt.sign( //payload
    {_id:data._id}, //solo paso el id del objeto, el resto lo manejo en la propia funcion
    JWT,
    {expiresIn:"365d"}//uso este sing para todos 
  )
  return sing
};

const verifyToken = (tokenJwt) => {
  try{
  return jwt.verify(tokenJwt,JWT)
  }
  catch (err) {
  console.log(err)
  }
}

//toma el token de el parametro y lo verifica
//solo la hice para acortar este paso en las demas peticiones
const checkToken = async (req,res,next) => {
  try{
    const token = req.headers.authorization.split(" ").pop()
    const dataToken = verifyToken(token)
    const id = dataToken._id
    return id
    next()
  }
  catch(error){
    console.log(error)
    handleHttpError(res,"ERROR")
  }
};



module.exports = {tokenSing,verifyToken, checkToken}