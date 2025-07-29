import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import fs from 'fs/promises';
import express from 'express';
import jsonServer from 'json-server';
import jwt from 'jsonwebtoken';
import { requireAuth } from './src/api/middleware/authMiddleware';
import type {Client} from './src/types/clients'

// loads .env → process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const server = express();
const router = jsonServer.router('db.json') as any;
const middle = jsonServer.defaults(); // logger, CORS, etc.

// turn off ETag so clients always get a fresh 200+JSON response
server.disable('etag');

// optional: also prevent all HTTP caching
server.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// server.use(express.json());
server.use(middle);


/* ---------- public login (add parser JUST for this route) -------- */
server.post('/api/login', express.json(), (req, res) => {
  const { email, password } = req.body;

  const validEmail = 'admin@demo.com';
  const validPassword = '@Passw0rd';

  // Simulate 1 second delay
  setTimeout(() => {
    if (email !== validEmail) {
      return res.status(401).json({ error: 'email_not_found' });
    }

    if (password !== validPassword) {
      return res.status(401).json({ error: 'incorrect_password' });
    }

    const token = jwt.sign({ sub: email }, JWT_SECRET, { expiresIn: '30m' });
    return res.json({ token });
  }, 1000); 
});



/** ── CUSTOM PAGINATION ROUTE ───────────────────────────────────── */
server.get('/api/clients', requireAuth, async (req, res) => {
  // parse & default page/limit
  const page  = parseInt((req.query._page as string)  ?? '1', 10);
  const limit = parseInt((req.query._limit as string) ?? '10', 10);
  const start = (page - 1) * limit;

  // load and parse db.json
  const file = path.join(__dirname, 'db.json');
  const text = await fs.readFile(file, 'utf-8');
  const db   = JSON.parse(text) as { clients: any[] };

  // apply global search if present
  let list = db.clients;
  if (req.query.q) {
    const q = String(req.query.q).toLowerCase();
    list = list.filter((c) =>
      Object.values(c).some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }

  // sort by name asc (your requirement)
  list.sort((a, b) => a.name.localeCompare(b.name));

  // total before slicing
  const total = list.length;
  // slice for this page
  const slice = list.slice(start, start + limit);

  // set x-total-count for the client
  res.setHeader('X-Total-Count', String(total));
  // send JSON slice
  res.json(slice);
});

server.get('/api/clients/all', requireAuth, async (req, res) => {
  const text = await fs.readFile(path.join(__dirname, 'db.json'), 'utf-8');
  const data = JSON.parse(text) as { clients: Client[] };
  res.setHeader('X-Total-Count', String(data.clients.length));
  res.json(data.clients);
});

/** ── END CUSTOM ROUTE ───────────────────────────────────────────── */
/* ---------- protected JSON Server routes ------------------------ */
server.use('/api', requireAuth, router); // /api/clients & all CRUD under it
// add more protected paths the same way.

/* ---------- boot ----------------------------------------------- */
const PORT = Number(process.env.PORT) || 4000;
server.listen(PORT, () => console.log(`API up on ${PORT}`));

