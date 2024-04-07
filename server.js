const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());

// Middleware para manejar errores globalmente
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Middleware para soporte CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/recetas', (req, res) => {
    const { cafe } = req.query;
    fs.readFile('recetas.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de recetas');
            return;
        }
        const recetas = JSON.parse(data).recetas;
        const recetaEncontrada = recetas.find(item => item.nombre.toLowerCase() === cafe.toLowerCase());
        if (recetaEncontrada) {
            res.json(recetaEncontrada);
        } else {
            res.status(404).send('Receta no encontrada');
        }
    });
});

app.post('/agregar-receta', (req, res) => {
    const nuevaReceta = req.body;
    fs.readFile('recetas.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de recetas');
            return;
        }
        const recetas = JSON.parse(data);
        recetas.recetas.push(nuevaReceta);
        fs.writeFile('recetas.json', JSON.stringify(recetas, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error al escribir en el archivo de recetas');
                return;
            }
            res.status(201).send('Receta agregada correctamente');
        });
    });
});

module.exports = app;
