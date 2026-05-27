const express = require('express');
const path = require('path');
const app = express();

// Permitir el parseo de JSON en las peticiones
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Puerto configurable a través de variables de entorno (muy importante para DevOps/Docker)
const PORT = process.env.PORT || 3000;

// Base de datos en memoria para propósitos de demostración y simplicidad
let people = [
  { id: '1', name: 'David Perez', age: 25 },
  { id: '2', name: 'Jesica Solano', age: 32 },
  { id: '3', name: 'Cesar Olarte', age: 19 }
];

// Endpoint API para obtener la lista de personas
app.get('/api/people', (req, res) => {
  res.json(people);
});

// Endpoint API para registrar una nueva persona
app.post('/api/people', (req, res) => {
  const { id, name, age } = req.body;

  // Validaciones básicas de campos requeridos
  if (!id || !name || age === undefined) {
    return res.status(400).json({ error: 'Todos los campos (ID, Nombre y Edad) son requeridos.' });
  }

  // Sanitizar y validar tipos
  const parsedAge = parseInt(age, 10);
  if (isNaN(parsedAge) || parsedAge < 0) {
    return res.status(400).json({ error: 'La edad debe ser un número entero no negativo.' });
  }

  const cleanId = id.toString().trim();
  const cleanName = name.toString().trim();

  if (cleanId === '' || cleanName === '') {
    return res.status(400).json({ error: 'El ID y el Nombre no pueden estar vacíos.' });
  }

  // Validar si el ID ya existe en nuestra base de datos en memoria
  const idExists = people.some(person => person.id.toLowerCase() === cleanId.toLowerCase());
  if (idExists) {
    return res.status(409).json({ error: `El ID "${cleanId}" ya está registrado.` });
  }

  // Crear y guardar la nueva persona
  const newPerson = {
    id: cleanId,
    name: cleanName,
    age: parsedAge
  };

  people.push(newPerson);
  res.status(201).json(newPerson);
});

// Ruta comodín para redirigir cualquier otra petición al index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(` Servidor corriendo en http://localhost:${PORT} `);
  console.log();
  console.log(`===================================================`);
});
