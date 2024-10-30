const express = require("express")
const userModel = require("../models/NoSql/usuarios")
const {matchedData} = require("express-validator")
const {handleHttpError} = require("../utils/handleError")
const {tokenSing} = require("../utils/handleJwt")
const {encrypt} =require("../utils/handlePassword")


//retorna a todos los usuarios en el modelo
const getUsuarios = async (req,res) => {
  try{
      const data = await userModel.find({})
      res.json(data)
  }
  catch{
    handleHttpError(res, "ERROR_GET_USERS]", 500)
  }
};
//retorna a usuario por su id como parametro
const getUsuario = async (req,res) => {
  try{
    const {id} = matchedData(req)
    const data = await userModel.findById(id)
    if (!data) {
      res.status(404).json({message:"usuario no encontrado"})
    }
    res.json(data)
  }
  catch{
    handleHttpError(res, "ERROR_GET_USERS]", 500)
  }
};


//crear un usuario (solo la utilizo para crear al admin y su token)
const crearUsuario = async (req,res) =>{
  try{
    req = matchedData(req)
    const password = await encrypt(req.password)
    const body = { ...req, password } // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
    const dataUser = await userModel.create(body) //se guardan los datos con la contrasena encriptada con el hash
    dataUser.set('password', undefined, { strict: false })

    const data = {
        token: tokenSing(dataUser),//se crea el token del usuario y se retorna
        user: dataUser
    }
    
    res.send(data)
} 
catch (error) {
    console.log(error)
    handleHttpError(res,"ERROR",500)
}
};

//actualiza a un usuario por su id 
const actualizarUsuario = async (req,res) => {
  const {id} = matchedData(req)
  try{
  const data = await userModel.findOneAndUpdate({_id:id})
  res.send(data)
  }
  catch(error){
  handleHttpError(res,"ERROR_UPDATE_USER")
  }
};


//borrar a un usuario (por defecto soft delete, ?physical=true para Hard delete)
const deleteUsuario = async (req,res) => {
  const {id} = matchedData(req)
  try{
    let data;
    if (req.query.physical==="true"){
      const data = await userModel.deleteOne({_id:id})
      res.json("usuario eliminado permanentemente")
    }
    else{
      const data = await userModel.delete({_id:id})
      res.json("usuario eliminado")
    }


  }
  catch (error){
    handleHttpError(res,"ERROR_DELETE_USER")
  }
};

module.exports={crearUsuario,deleteUsuario,actualizarUsuario,getUsuario,getUsuarios}





