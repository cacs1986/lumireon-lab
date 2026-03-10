import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

//Inicializamos el servidor
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET;

// --- MIDDLEWARE DE AUTENTICACIÓN ---
const verificarToken = (req, res, next) => {
  // 1. Buscamos el token en las cabeceras de la petición
  const authHeader = req.headers['authorization'];

  // El formato estándar es "Bearer eyJhbGciOi...", así que extraemos solo el token
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
  }

  // 2. Verificamos que el token sea auténtico y no haya expirado
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }

    // Si es válido, guardamos los datos del usuario en la request y continuamos
    req.user = user;
    next();
  });
};

//Middlewares (CORS para conectar con Vite y JSON para leer los envíos del formulario)
app.use(cors());
app.use(express.json());

//Conexión a la Base de Datos SQLite
const db = new sqlite3.Database('./laboratorio.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    crearTablas();
  }
});

function crearTablas() {
  const sqlProjets = `
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      imagen_url TEXT,          
      repositorio_url TEXT,
      codigo_snippet TEXT,     
      context TEXT NOT NULL,
      problem TEXT NOT NULL,
      process TEXT NOT NULL,
      difficulties TEXT,
      learnings TEXT NOT NULL,
      status TEXT DEFAULT 'En evolución',
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(sqlProjets, (err) => {
    if (err) {
      console.error('Error al crear la tabla:', err.message);
    } else {
      console.log('Tabla "projects" lista.');
    }
  });

  const sqlUsers = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `;

  db.run(sqlUsers, async (err) => {
    if (!err) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const plainPassword = process.env.ADMIN_PASSWORD;

      if (!adminEmail || !plainPassword) {
        console.error('ADVERTENCIA: Faltan ADMIN_EMAIL o ADMIN_PASSWORD. El administrador no será creado.');
        return; 
      }

      db.get(`SELECT * FROM users WHERE email = ?`, [adminEmail], async (err, row) => {
        if (!row) {
          const hashedPassword = await bcrypt.hash(plainPassword, 10);
          const userId = crypto.randomUUID();

          db.run(`INSERT INTO users (id, email, password) VALUES (?, ?, ?)`, [userId, adminEmail, hashedPassword]);
          console.log(`Usuario administrador (${adminEmail}) creado con éxito.`);
        }
      });
    }
  });

}

// --- CREAR UN PROYECTO (POST) ---
app.post('/api/projects', verificarToken, (req, res) => {
  const { title, slug, imagen_url, repositorio_url, codigo_snippet, context, problem, process, difficulties, learnings, status, tags } = req.body;
  const id = crypto.randomUUID();
  const tagsString = Array.isArray(tags) ? tags.join(',') : '';
  const sql = `
  INSERT INTO projects 
  (id, title, slug, imagen_url, repositorio_url, codigo_snippet, context, problem, process, difficulties, learnings, status, tags) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [id, title, slug, imagen_url, repositorio_url, codigo_snippet, context, problem, process, difficulties, learnings, status, tagsString], function (err) {
    if (err) {
      console.error('Error al insertar el proyecto:', err.message);
      return res.status(400).json({ error: 'Error al guardar. ¿El slug ya existe?' });
    }
    console.log(`Proyecto insertado con ID: ${id}`);
    res.status(201).json({ message: 'Proyecto guardado con éxito', id });
  });
});

// --- OBTENER UN PROYECTO POR ID ---
app.get('/api/projects/id/:id', (req, res) => {
  const sql = `SELECT * FROM projects WHERE id = ?`;

  db.get(sql, [req.params.id], (err, row) => {
    if (err)
      return res.status(500).json({ error: 'Error al consultar BD' });
    if (!row)
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    const formattedRow = {
      ...row,
      tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
      createdAt: row.created_at
    };
    res.json(formattedRow);
  });
});

// --- ACTUALIZAR UN PROYECTO ---
app.put('/api/projects/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { title, slug, imagen_url, repositorio_url, codigo_snippet, context, problem, process, difficulties, learnings, status, tags } = req.body;
  const tagsString = Array.isArray(tags) ? tags.join(',') : '';
  const sql = `
    UPDATE projects 
    SET title = ?, slug = ?, imagen_url = ?, repositorio_url = ?, codigo_snippet = ?, context = ?, problem = ?, process = ?, difficulties = ?, learnings = ?, status = ?, tags = ?
    WHERE id = ?
  `;

  db.run(sql, [title, slug, imagen_url, repositorio_url, codigo_snippet, context, problem, process, difficulties, learnings, status, tagsString, id], function (err) {
    if (err) {
      console.error('Error al actualizar:', err.message);
      return res.status(400).json({ error: 'Error al actualizar. ¿Slug duplicado?' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado para actualizar' });
    }

    res.json({ message: 'Proyecto actualizado con éxito' });
  });
});

// --- ELIMINAR UN PROYECTO (DELETE) ---
app.delete('/api/projects/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM projects WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error al eliminar:', err.message);
      return res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({ message: 'Proyecto eliminado con éxito' });
  });
});

// --- OBTENER TODOS LOS PROYECTOS ---
app.get('/api/projects', (req, res) => {
  const sql = `SELECT * FROM projects ORDER BY created_at DESC`;

  // db.all trae múltiples filas
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar la base de datos' });
    }

    const formattedRows = rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
      createdAt: row.created_at
    }));

    res.json(formattedRows);
  });
});

// --- OBTENER UN PROYECTO POR SLUG ---
app.get('/api/projects/:slug', (req, res) => {
  const sql = `SELECT * FROM projects WHERE slug = ?`;

  db.get(sql, [req.params.slug], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar la base de datos' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const formattedRow = {
      ...row,
      tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
      createdAt: row.created_at
    };

    res.json(formattedRow);
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ message: 'Login exitoso', token });
  });

});

app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});