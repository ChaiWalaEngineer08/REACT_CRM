// mock-api.js  –  start with:  node mock-api.js
import jsonServer from 'json-server';
import path       from 'node:path';
import { fileURLToPath } from 'node:url';

/* Optional auth / custom middleware — comment out if you don’t need it */
// import auth from './json-auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* core helpers ------------------------------------------------------ */
const server      = jsonServer.create();
const middlewares = jsonServer.defaults();          // logger, CORS, etc.
const router      = jsonServer.router(
  path.join(__dirname, 'db.json')                   // <-- your seed file
);

/* middleware chain -------------------------------------------------- */
server.use(middlewares);
// server.use(auth);                                // <- if you have auth.js
server.use('/api', router);                         // nice prefix

/* kick-off ---------------------------------------------------------- */
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`✅  Mock API ready at http://localhost:${PORT}/api`)
);
