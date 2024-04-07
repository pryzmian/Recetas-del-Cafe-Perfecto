const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000; // Utiliza el puerto proporcionado o el 3000 si no está definido
// Listen on the port:
app.listen(PORT, () => console.log('Listening on', PORT));

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/recetas', (req, res) => {
    const { cafe, busqueda } = req.query;
    fs.readFile('recetas.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de recetas');
            return;
        }
        const recetas = JSON.parse(data).recetas;
        let recetaEncontrada;
        if (cafe) {
            recetaEncontrada = recetas.find(item => item.nombre.toLowerCase() === cafe.toLowerCase());
        } else if (busqueda) {
            recetaEncontrada = recetas.filter(item => item.nombre.toLowerCase().includes(busqueda.toLowerCase()));
        }
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
