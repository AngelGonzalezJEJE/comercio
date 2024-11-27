const express = require("express")
const {paginaWebModel,comercioModel,userModel}= require("../models")
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
    handleHttpError(res, "ERROR_GET_USERS", 500)
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
const actualizarUsuario = async (req, res) => {
    
  try {
    // Update user data by ID
    const  id  = req.params.id;  
    const updateData = req.body;  
    const data = await userModel.findByIdAndUpdate(
      id,                        // Pass the ID directly
      updateData,                // Update with data from request body
      { new: true }              // Return the updated document
    );

    if (!data) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send(data);               // Send the updated user data
  } catch (error) {
    console.error("Error updating user:", error);
    handleHttpError(res, "ERROR_UPDATE_USER"); // Handle error response
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

const rateWebSite = async (req, res) => {
  const user = req.user;
  const pageid = req.params.id;
  const { rating, comentario } = req.body;

  try {
    const page = await paginaWebModel.findById(pageid);

    if (!page) {
      handleHttpError(res, "ERROR_PAGE_NOT_FOUND", 404);
      return;
    }

    // Find if the user has already rated this page
    const userIndex = page.reseñas.ratings.findIndex(r => r.userId.toString() === user._id.toString());

    if (userIndex !== -1) {
      // If the user has already rated, update the rating and comment
      page.reseñas.ratings[userIndex].rating = rating; // Update the rating
      page.reseñas.ratings[userIndex].userName = user.nombre; // Update the userName (optional)

      // Update the comment at the same index in the comentarios array
      page.reseñas.comentarios[userIndex].comentario = comentario; // Update only the comment text
      page.reseñas.comentarios[userIndex].userName = user.nombre; // Update the userName (optional)
    } else {
      // If the user hasn't rated yet, add a new rating and comment
      page.reseñas.ratings.push({ rating, userName: user.nombre, userId: user._id });
      page.reseñas.comentarios.push({ comentario, userName: user.nombre, userId: user._id });
    }

    // Recalculate the scoring (assuming you have this method in your model)
    page.calculateScoring();

    // Save the updated page
    await page.save();

    // Send the response
    res.json({
      message: "Rating added successfully",
      page,
    });
  } catch (error) {
    console.error(error);
    handleHttpError(res, "ERROR_RATING", 500);
  }
};


module.exports={crearUsuario,deleteUsuario,actualizarUsuario,getUsuario,getUsuarios, rateWebSite}





