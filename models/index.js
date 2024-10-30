const models = {
  comercioModel: require("./NoSql/comercio"),
  paginaWebModel: require("./NoSql/paginaWeb"),
  userModel: require("./NoSql/usuarios")
}

module.exports = models //indice para los modelos de base de datos mongoose