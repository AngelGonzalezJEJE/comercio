const express = require("express")
const {handleHttpError} = require("../utils/handleError")
const {tokenSing,verifyToken} = require("../utils/handleJwt")
const { encrypt, compare} = require("../utils/handlePassword")
const {matchedData}= require("express-validator")
const {userModel} = require("../models")

//Registro del ususario
const userRegister =async (req,res) => {
  try{
    req = matchedData(req) //validacion de los datos
    const password = await encrypt(req.password)//se encripta la contrasena y para guardar el hash en la base de datos
    const body = { ...req, password } // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
    const dataUser = await userModel.create(body) //se guardan los datos con la contrasena encriptada con el hash
    dataUser.set('password', undefined, { strict: false })//para no devolver la contrasena en la respuesta o el en token
    const data = {//se define el dataUser como payload del token y se genera
        token: tokenSing(dataUser),
        user: dataUser
    }
    
    res.send(data)
} 
catch (error) {
    console.log(error)
    handleHttpError(res,"ERROR",500)
}
};


//loging del usuario
const userLogin = async (req,res) => {
  try{
    req=matchedData(req) //validacion de los datos
    //se encuentra al usuario por su email
    const user = await userModel.findOne({email:req.email}).select("password nombre ciudad edad intereses role email")
    if (!user) {//si no existe
      handleHttpError(res, "USER_NOT_EXISTS",404)
      return
    }
    //se toma la contrasena hasheada del usuario
    const hashPassword = user.password;
    //se compara la contrasena del usuario con el hash almacenado 
    //combrueba que  el hash de la contrasena 
    const check = await compare(req.password, hashPassword)

    if (!check){
      handleHttpError(res,"INVALID_PASSWORD",401)
      return
    }
    user.set("password",undefined, {strict:false})
    const data = {
      token: tokenSing(user),
      user
    }
    res.send(data)
  }
  catch(err){
    console.log(err)
    handleHttpError(res, "ERROR_LOGIN_USERS]", 500)
  }
};

const authCommerceToken = async (req,res) => {

  const {token} = matchedData(req)
  try{

    const commerceToken = verifyToken(token)
    res.send(commerceToken)

  }
  catch(error){
    console.error(error)
  }
};
module.exports = {userLogin,userRegister,authCommerceToken};