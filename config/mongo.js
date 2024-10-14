//conexion a mongoDBD
const {default:mongoose} = require("mongoose")

const dbConnect = () => {
    const db_uri = process.env.DB_URI //se lama a la url de mongoDB declarada en el archivo .env
    mongoose.set('strictQuery', false)

    try {
        mongoose.connect(db_uri) //conexion a la base de datos
    } catch (error) {
        console.err("No se ha podido establecer la conexion a la base de datos...", error)//si hay un problema al conectar se imprime el error
    }
    mongoose.connection.on('connected',() => console.log('Conectado a la base de datos'));//si la conexion es exitosa
}

module.exports = dbConnect //se exporta la funcion para la conexion