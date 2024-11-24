const express=require("express");
const cors = require("cors")//lo necesito :)
const dbConnect=require("./config/mongo")//importacion para la conexion a la base de datos
require("dotenv").config()
const morganBody = require("morgan-body")
const { IncomingWebhook } = require("@slack/webhook")
const swaggerUi = require("swagger-ui-express")
const swaggerSpecs = require("./docs/swagger")
const loggerStream = require("./utils/handleLogger")



dbConnect()//se establece la conexion a la base de datos
const app = express();

app.use(express.json());// para parsear el body de las peticiones en JSON
app.use(cors())//lo necesito :)

app.use("/api-docs", swaggerUi.serve,swaggerUi.setup(swaggerSpecs))

app.use("/api",require("./routes"))//se aplican las operciones CRUD en todas las url definidas en routes
app.use(express.static("storage"))

const webHook = new IncomingWebhook(process.env.SLACK_WEBHOOK)

morganBody(app, {
  noColors: true,
  skip: function (req,res) {
    return res.statusCode < 400
  },
  stream: loggerStream
})
module.exports= app

const port = process.env.PORT || 3000;//se llama al puerto definido en .env, si no, sera 3000

app.listen(port,console.log(`Servidor en linea desde puerto: ${port}...`));//comprobar que el servidor esta en linea