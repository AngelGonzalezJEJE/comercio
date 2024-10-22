const express = require('express')
const paginaWebModel = require('../models/NoSql/paginaWeb')//se llama al modelo de  pagina Web
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError')
const fs = require("fs")

//se obtiene la pagina web por el id en el parametro, si hay algun error lo devuelve
const paginaWebPorId = async (req,res) => {
  const {id} = matchedData(req) // se toma el id de la url y se valida con mached data
  try{
    const data = await paginaWebModel.findById(id) // se busca el documento por su id
    if (!data) {
      return res.status(404).json({ message: "Pagina web no encontrada" }); // si no se encuentra 
    }
  res.json(data);// devuelve el documento si se encuentra
  }
  catch (error) {
    handleHttpError(res, 'ERROR_GET_PAGE', 500); //error interno
  }
};

//crear una documento para los datos de una pagina web
const crearPaginaWeb = async (req,res) => {
  try{
    const body = matchedData(req) //se toman y se validan todos los campos de la solicitud (body)
    const data = await paginaWebModel.create(body)//si todo esta correcto se crea el documento
  res.send(data)//se retorna el documento creado
  }
  catch (error){
    handleHttpError(res, 'ERROR_CREATE_PAGE', 500)//error interno
  }
};


//modifica una pagina web por su id
const modificarPaginaWeb = async (req, res) => {
  try {
    const id = req.params.id;//se toma el id de la solicitud
    const body = matchedData(req);//se toman y se validan todos los campos de la solicitud (body)
    const data = await paginaWebModel.findByIdAndUpdate(id, body, { new: true });//si todo es correcto se busca el documento por su id y se actualiza 
    if (!data) {
      return res.status(404).json({ message: "pagina web no encontrada" });//si no existe
    }
    res.status(200).json(data);//retorna el documento editado
  } catch (error) {
    handleHttpError(res, 'ERROR_UPDATE_PAGE', 500);//error interno
  }
};

//borra un documento de la base de datos por su id
const borrarPaginaWeb = async (req,res) => {
  const {id} =  matchedData(req)//se toma y se valida la id de la solicitud
  try{
    let data;//
    if (req.query.physical ==="true"){//physical indica si la eliminacion es fisica (Hard Delete)
      const data = await paginaWebModel.deleteOne({_id:id})//deleteOne borra el documento permanentemente si ?physical=true
      res.json({menasje:"pagina web eliminada permanentemente"})//confirmacion de eliminacion
    }
    else {//por defecto se marcan los documentos como eliminados pero no se borran definitivamente de la base de datos(soft delete)
      const data = await paginaWebModel.delete({_id:id})
      res.json({menasje:"pagina web eliminada"})//confirmacion de eliminacion
    }
  }
  catch (error){
    rehandleHttpError(res, 'ERROR_DELETE_PAGE', 500)//error interno
  }
};

const crearImagen = async (req, res) => {
  // Access the file from req.file
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const { filename } = req.file; // se almacena el nombre del archivo
  const { id } = req.params; // ID de la pagina en  la url 
  // para guardar los datos de la imagen (nombre y url)
  const fileData = {
    filename: filename,
    url: `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : 'http://localhost:3000'}/${filename}` //se concatena el nombre del archivo con la ulr del servidor
  };
  try {
    // se ecuentra el documeto por su id y se actualiza el array de imagenes
    const pagina_act = await paginaWebModel.findByIdAndUpdate(
      id,
      { $push: { imagenes: fileData.url } }, //anade el objeto completo
      { new: true } // retorna el campo actualizado
    );

    if (!pagina_act) {// si no existe la pagina
      return res.status(404).json({ error: "no encontrado" });
    }
    res.status(200).json({ message: "Imagen subida correctamente", fileData });//confirmacion de subida de imagen
  } catch (error) {
    console.error(error);
    handleHttpError(res, 'ERROR_UPLOAD_IMAGE', 500);//error interno
  }
};

module.exports= {paginaWebPorId,crearPaginaWeb, modificarPaginaWeb,borrarPaginaWeb,crearImagen}//exportacion