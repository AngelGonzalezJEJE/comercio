const express = require("express");
const fs = require("fs");
const router = express.Router();

const removeExtension = (fileName) => {
    return fileName.split(".").shift();
};

fs.readdirSync(__dirname).filter((file) => {
    const name = removeExtension(file);
    if (name !== "index") {
        const route = require("./" + name);  // Importa el archivo de ruta
        console.log(`Loading route '${name}':`, typeof route);
        
        // Verifica que lo que exporta sea una función de middleware
        if (typeof route === 'function' || typeof route === 'object') {
            router.use("/" + name, route);  // Usa la ruta solo si es válida
        } else {
            console.error(`Error: ${name} no exporta una función de middleware.`);
        }
    }
});

module.exports = router;