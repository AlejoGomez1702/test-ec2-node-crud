const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Puedes cambiar el puerto si lo deseas

// Configuración de la base de datos SQLite
const db = new sqlite3.Database('fruits.db');

// Crear la tabla de frutas si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS fruits (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
  )
`);

app.use(bodyParser.json());

// Rutas para CRUD de frutas
app.get('/fruits', (req, res) => {
  db.all('SELECT * FROM fruits', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/fruits/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM fruits WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Fruit not found' });
      return;
    }
    res.json(row);
  });
});

app.post('/fruits', (req, res) => {
  const { name, description } = req.body;
  db.run('INSERT INTO fruits (name, description) VALUES (?, ?)', [name, description], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Fruit added successfully' });
  });
});

app.put('/fruits/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.run('UPDATE fruits SET name = ?, description = ? WHERE id = ?', [name, description, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Fruit updated successfully' });
  });
});

app.delete('/fruits/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM fruits WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Fruit deleted successfully' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});