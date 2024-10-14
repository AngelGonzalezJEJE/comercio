const express=require("express");
const cors = require("cors")//lo necesito :)
const dbConnect=require("./config/mongo")//importacion para la conexion a la base de datos
const routes = require("./routes/comercio")//importacion de las rutas para las peticiones

require("dotenv").config()

dbConnect()//se establece la conexion a la base de datos
const app = express();

app.use(express.json());// para parsear el body de las peticiones en JSON
app.use(cors())//lo necesito :)

app.use("/api/comercio", routes)//se aplican las operciones CRUD en todas las url que empiecen con esta ruta

const port = process.env.PORT || 3000;//se llama al puerto definido en .env, si no, sera 3000

app.listen(port,console.log(`Servidor en linea desde puerto: ${port}...`));//comprobar que el servidor esta en linea