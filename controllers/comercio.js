const express = require('express')
const comercioModel = require('../models/NoSql/comercio')//se llama al modelo de comercio
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError')

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
        res.json(nuevoComercio); // Devolver el comercio creado
      } catch (error) {
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


module.exports ={getComercios,comercioPorCif,actualizarComercioCif,crearComercio,borrarComercio}// exportacion