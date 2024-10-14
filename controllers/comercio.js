const express = require('express')
const comercio = require('../models/NoSql/comercio')//se llama al modelo de comercio

//getComercios devuelve todos los registros en la base de datos
const getComercios = async (req,res) => {
    try{
        const comercios = await comercio.find() //selecciona todo el contenido del schema
        res.json(comercios) //y lo retorna
    } catch (error) {
        res.json({ mensaje: 'Error interno del servidor' }); // error interno
      }
};

//comercioPorCif duelve un registro de la base de datos por el CIF del comercio si existe
const comercioPorCif = async (req,res) => {
    const cif = req.params.cif; // el cif se obtiene directamente desde el request-url 
    try {
        const comerciopcif= await comercio.findOne({ cif: cif}); // Busqueda del registro con el cif requerido
        if (comerciopcif) {
          res.json(comerciopcif); // Devolver comercio si existe
        } else {
          res.json({ mensaje: 'Comercio no encontrado' }); // comercio no encontrado
        }
      } catch (error) {
        res.json({ mensaje: 'Error interno del servidor', error}); // interno error
      }
    };
//crearComercio crea un registro dentro de la base de datos y lo devuelve
const crearComercio = async (req,res) => {
    const nuevoComercio = new comercio(req.body); //se toman los datos de l bpdy
    try {
        await nuevoComercio.save(); // Guardar el comercio
        res.json(nuevoComercio); // Devolver el comercio creado
      } catch (error) {
        res.json({ mensaje: 'Error al crear el comercio' });
      }
    };


  //actualizar un comercio en la base de datos por su CIF
const actualizarComercioCif  = async (req,res) => {
    const cif = req.params.cif;
  try{
    const comeract = await comercio.findOneAndUpdate({cif:cif}, req.body, {new:true})//encuetra el registro con el cif y lo actualiza
     if (comeract){
        res.json(comeract) //se actualiza el registro con los datos del body si existe.
    }
    else {
        res.json({ mensaje: 'comercio no encontrado' }) //si no se encuentra

    }
  }  catch (error) {
    res.json({ mensaje: 'Error' }); //error
  }

}
//Borra registro de la base de datos por cif 
const borrarComercio = async (req,res) => {
    const cif = req.params.cif;
    try{
    const comercioABorrar = await comercio.findOneAndDelete({cif:cif}) //se encuetra el registro con el cif y lo elimina
    if (comercioABorrar){
        res.json({menasje:"comercio eliminado"})     //confirmacion de eliminacion 
    } else{                           
    res.json({ mensaje: 'Comercio no encontrado'}) //si no existe
    }
      } catch (error) {
        res.json({ mensaje: 'Error',error }); 
      }
    
}


module.exports ={getComercios,comercioPorCif,actualizarComercioCif,crearComercio,borrarComercio}// exportacion