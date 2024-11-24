const express = require('express')
const {comercioModel} = require('../models')//se llama al modelo de comercio
const {paginaWebModel}= require("../models")
const {userModel} = require("../models")
const {matchedData} = require('express-validator')
const {handleHttpError} = require('../utils/handleError')
const {tokenSing} = require("../utils/handleJwt")
const { sendEmail } = require('../utils/handleEmail')


const send = async (req, res) => {
  try {
    const info = matchedData(req)
    const data = await sendEmail(info)
    res.send(data)
  } catch (err) {
    //console.log(err)
    handleHttpError(res, 'ERROR_SEND_EMAIL')
  }
}

module.exports = { send }

//getComercios devuelve todos los registros en la base de datos
const getComercios = async (req,res) => {
    try{
        const comercios = await comercioModel.find() //selecciona todo el contenido del schema
        res.json(comercios) //y lo retorna
    } catch (error) {
        handleHttpError(res, 'ERROR_GET_ITEMS', 500)
        console.log(res); // error interno
      }
};

//comercioPorCif duelve un registro de la base de datos por el CIF del comercio si existe
const comercioPorCif = async (req,res) => {
    const {cif} = matchedData(req); // el cif se obtiene directamente desde el request-url 
    try {
        const comerciopcif= await comercioModel.findOne({ cif: cif}); // Busqueda del registro con el cif requerido
        console.log(comerciopcif)
        if (comerciopcif) {
          res.json(comerciopcif); // Devolver comercio si existe
        } else {
          res.json({ mensaje: 'Comercio no encontrado' }); // comercio no encontrado
        }
      } catch (error) {
        handleHttpError(res, 'ERROR_GET_ITEM', 500); // interno error
      }
    };
//crearComercio crea un registro dentro de la base de datos y lo devuelve
const crearComercio = async (req,res) => {
    const body = matchedData(req); //se toman los datos de l bpdy
    try {
        const nuevoComercio = await comercioModel.create(body); // Guardar el comercio
        const data = {
          token: tokenSing(nuevoComercio),
          nuevoComercio
        }
        res.send(data); // Devolver el comercio creado
      } catch (error) {
        console.log(error
        )
        handleHttpError(res,'ERROR_CREATE_ITEM', 500 );
      }
    };


  //actualizar un comercio en la base de datos por su CIF
const actualizarComercioCif  = async (req,res) => {
    const {cif} = matchedData(req)
  try{
    const comeract = await comercioModel.findOneAndUpdate({cif:cif}, req.body, {new:true})//encuetra el registro con el cif y lo actualiza
    if (comeract){
        res.json(comeract) //se actualiza el registro con los datos del body si existe.
    }
    else {
        res.json({ mensaje: 'comercio no encontrado' }) //si no se encuentra

    }
  }  catch (error) {
    handleHttpError(res, 'ERROR_UPDATE_ITEM', 500); //error iterno
  }

}
//Borra registro de la base de datos por cif 
const borrarComercio = async (req,res) => {
    const {cif} = matchedData(req)
    try{
    let data;
        if (req.query.physical ==="true"){
        const data = await comercioModel.deleteOne({cif:cif})
        res.json({menasje:"comercio eliminado permanentemente"})//confirmacion de eliminacion
        } //se encuetra el registro con el cif y lo elimina permanentemente con deleteOne (Hard delete) si el request tiene ?physical=true
        else {
        const data = await comercioModel.delete({cif:cif})//del resto marca como borrado con delete (soft delete)
        res.json({menasje:"comercio eliminado"})//confirmacion de eliminacion
        };   
    } 
    catch (error) {
      handleHttpError(res, 'ERROR_UPDATE_ITEM', 500); //error interno
    }
};
    
const getEmailInteresados = async (req, res) => {
  const { comercio } = req; // Extract the comercio object from the request
  const cif = comercio.cif;
  try {  
      const paginaWeb = await paginaWebModel.findOne({ cif:cif });


      if (!paginaWeb) {
          return res.status(404).send("ERROR_UNDEFINED_PAGINAWEB"); // Use status code 404 for not found
      }
      const actividad = paginaWeb.actividad;

      // Find users interested in the activity
      const interesados = await userModel.find({ "intereses": actividad });

      // Filter users who have the option to receive offers activated
      const interesadosFilter = interesados.filter(user => user.permiteRecibirOfertas === true);

      // Map to get the emails of interested users
      const emails = interesadosFilter.map(user => user.email);

      // Send the array of emails as the response
      return res.send(emails);
  } catch (error) {
      console.error(error); // Log the error for debugging
      return handleHttpError(res, "ERROR"); // Use return to prevent further execution
  }
};


module.exports = {getComercios,comercioPorCif,actualizarComercioCif,crearComercio,borrarComercio, getEmailInteresados,send}