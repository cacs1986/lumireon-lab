import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET;

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso denegado. No hay token.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado.' });
    req.user = user;
    next();
  });
};

app.use(cors());
app.use(express.json());

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error("FALTAN CREDENCIALES DE TURSO EN EL .ENV");
  process.exit(1);
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function crearTablas() {
  try {
    await db.execute(`
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
        tipo TEXT DEFAULT 'personal', 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS materials (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL, 
        url TEXT NOT NULL,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tablas en Turso verificadas/creadas.');

    try {
      await db.execute(`ALTER TABLE projects ADD COLUMN tipo TEXT DEFAULT 'personal'`);
      console.log("Columna 'tipo' agregada a projects.");
    } catch (e) {
      // Si la columna ya existe, ignora el error y sigue.
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const plainPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && plainPassword) {
      const result = await db.execute({
        sql: `SELECT * FROM users WHERE email = ?`,
        args: [adminEmail]
      });
      
      if (result.rows.length === 0) {
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const userId = crypto.randomUUID();
        await db.execute({
          sql: `INSERT INTO users (id, email, password) VALUES (?, ?, ?)`,
          args: [userId, adminEmail, hashedPassword]
        });
        console.log(`Usuario administrador creado en Turso con éxito.`);
      }
    }
  } catch (error) {
    console.error("Error inicializando tablas en Turso:", error);
  }
}

crearTablas();

// ==========================================
//        RUTAS DE PROYECTOS
// ==========================================

app.post('/api/projects', verificarToken, async (req, res) => {
  const { title, slug, imagen_url, repositorio_url, codigo_snippet, context, problem, process, difficulties, learnings, status, tags, tipo } = req.body;
  const id = crypto.randomUUID();
  const tagsString = Array.isArray(tags) ? tags.join(',') : '';
  
  try {
    await db.execute({
      sql: `INSERT INTO projects (id, title, slug, imagen_url, repositorio_url, codigo_snippet, context, problem, process, difficulties, learnings, status, tags, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, title, slug, imagen_url, repositorio_url, codigo_snippet, context, problem, process, difficulties, learnings, status, tagsString, tipoProyecto]
    });
    res.status(201).json({ message: 'Proyecto guardado con éxito', id });
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar. ¿El slug ya existe?' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM projects ORDER BY created_at DESC`);
    const formattedRows = result.rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
      createdAt: row.created_at
    }));
    res.json(formattedRows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar Turso' });
  }
});

app.get('/api/projects/id/:id', async (req, res) => {
  try {
    const result = await db.execute({ sql: `SELECT * FROM projects WHERE id = ?`, args: [req.params.id] });
    if (result.rows.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    const row = result.rows[0];
    const formattedRow = { ...row, tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [], createdAt: row.created_at };
    res.json(formattedRow);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar BD' });
  }
});

app.get('/api/projects/:slug', async (req, res) => {
  try {
    const result = await db.execute({ sql: `SELECT * FROM projects WHERE slug = ?`, args: [req.params.slug] });
    if (result.rows.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    const row = result.rows[0];
    const formattedRow = { ...row, tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [], createdAt: row.created_at };
    res.json(formattedRow);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar BD' });
  }
});

app.put('/api/projects/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { title, slug, imagen_url, repositorio_url, codigo_snippet, context, problem, process, difficulties, learnings, status, tags, tipo } = req.body;
  const tagsString = Array.isArray(tags) ? tags.join(',') : '';
  const tipoProyecto = tipo || 'personal';
  
  try {
    const result = await db.execute({
      sql: `UPDATE projects SET title = ?, slug = ?, imagen_url = ?, repositorio_url = ?, codigo_snippet = ?, context = ?, problem = ?, process = ?, difficulties = ?, learnings = ?, status = ?, tags = ?, tipo = ? WHERE id = ?`,
      args: [title, slug, imagen_url, repositorio_url, codigo_snippet, context, problem, process, difficulties, learnings, status, tagsString, tipoProyecto, id]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json({ message: 'Proyecto actualizado con éxito' });
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar.' });
  }
});

app.delete('/api/projects/:id', verificarToken, async (req, res) => {
  try {
    const result = await db.execute({ sql: `DELETE FROM projects WHERE id = ?`, args: [req.params.id] });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json({ message: 'Proyecto eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// ==========================================
//        RUTAS DEL CRUD DE NOTAS 
// ==========================================
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'Servidor despierto' });
});


app.post('/api/notes', verificarToken, async (req, res) => {
  const { title, content } = req.body;
  const id = crypto.randomUUID();
  try {
    await db.execute({
      sql: `INSERT INTO notes (id, title, content) VALUES (?, ?, ?)`,
      args: [id, title, content]
    });
    res.status(201).json({ message: 'Nota guardada', id });
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar la nota' });
  }
});

app.get('/api/notes', async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM notes ORDER BY created_at DESC`);
    const formattedRows = result.rows.map(row => ({
      ...row,
      createdAt: row.created_at
    }));
    res.json(formattedRows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar BD' });
  }
});

app.get('/api/notes/:id', async (req, res) => {
  try {
    const result = await db.execute({ sql: `SELECT * FROM notes WHERE id = ?`, args: [req.params.id] });
    if (result.rows.length === 0) return res.status(404).json({ error: 'Nota no encontrada' });
    const row = result.rows[0];
    res.json({ ...row, createdAt: row.created_at });
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar BD' });
  }
});

app.put('/api/notes/:id', verificarToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await db.execute({
      sql: `UPDATE notes SET title = ?, content = ? WHERE id = ?`,
      args: [title, content, req.params.id]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Nota no encontrada' });
    res.json({ message: 'Nota actualizada' });
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar' });
  }
});

app.delete('/api/notes/:id', verificarToken, async (req, res) => {
  try {
    const result = await db.execute({ sql: `DELETE FROM notes WHERE id = ?`, args: [req.params.id] });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Nota no encontrada' });
    res.json({ message: 'Nota eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// ==========================================
//        RUTAS DEL CRUD DE MATERIALES
// ==========================================

app.post('/api/materials', verificarToken, async (req, res) => {
  const { title, description, type, url, tags } = req.body;
  const id = crypto.randomUUID();
  const tagsString = Array.isArray(tags) ? tags.join(',') : '';
  
  try {
    await db.execute({
      sql: `INSERT INTO materials (id, title, description, type, url, tags) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, title, description, type, url, tagsString]
    });
    res.status(201).json({ message: 'Material guardado', id });
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar el material' });
  }
});

app.get('/api/materials', async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM materials ORDER BY created_at DESC`);
    const formattedRows = result.rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
      createdAt: row.created_at
    }));
    res.json(formattedRows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar BD' });
  }
});

app.get('/api/materials/:id', async (req, res) => {
  try {
    const result = await db.execute({ sql: `SELECT * FROM materials WHERE id = ?`, args: [req.params.id] });
    if (result.rows.length === 0) return res.status(404).json({ error: 'Material no encontrado' });
    const row = result.rows[0];
    res.json({ ...row, tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [], createdAt: row.created_at });
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar BD' });
  }
});

app.put('/api/materials/:id', verificarToken, async (req, res) => {
  const { title, description, type, url, tags } = req.body;
  const tagsString = Array.isArray(tags) ? tags.join(',') : '';
  
  try {
    const result = await db.execute({
      sql: `UPDATE materials SET title = ?, description = ?, type = ?, url = ?, tags = ? WHERE id = ?`,
      args: [title, description, type, url, tagsString, req.params.id]
    });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Material no encontrado' });
    res.json({ message: 'Material actualizado' });
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar' });
  }
});

app.delete('/api/materials/:id', verificarToken, async (req, res) => {
  try {
    const result = await db.execute({ sql: `DELETE FROM materials WHERE id = ?`, args: [req.params.id] });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Material no encontrado' });
    res.json({ message: 'Material eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// ==========================================
//        RUTAS DE AUTENTICACIÓN
// ==========================================

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.execute({ sql: `SELECT * FROM users WHERE email = ?`, args: [email] });
    if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Credenciales inválidas' });
    
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});