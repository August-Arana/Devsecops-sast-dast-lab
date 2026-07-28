const express = require('express');
const { initDb, searchUsersUnsafe, searchUsersSafe } = require('./db');
const { STRIPE_SECRET_KEY, JWT_SIGNING_SECRET } = require('./secrets');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Vulnerable intencionalmente: headers de seguridad ausentes.
// En una app real podriamos usar helmet y una CSP bien definida.

app.get('/', (req, res) => {
  res.type('html').send(`
    <html>
      <head><title>DevSecOps Lab</title></head>
      <body>
        <h1>DevSecOps SAST/DAST Lab</h1>
        <p>Aplicacion vulnerable intencional para demostrar escaneos de seguridad.</p>
        <ul>
          <li><a href="/health">/health</a></li>
          <li><a href="/search?q=alice">/search?q=alice</a></li>
          <li><a href="/greet?name=Coderhouse">/greet?name=Coderhouse</a></li>
          <li><a href="/debug">/debug</a></li>
          <li><a href="/admin">/admin</a></li>
        </ul>
      </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'devsecops-lab', timestamp: new Date().toISOString() });
});

app.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const users = await searchUsersUnsafe(query);
    res.json({ query, users });
  } catch (error) {
    next(error);
  }
});

app.get('/search-safe', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const users = await searchUsersSafe(query);
    res.json({ query, users });
  } catch (error) {
    next(error);
  }
});

app.get('/greet', (req, res) => {
  const name = req.query.name || 'anonymous';
  // Vulnerable intencionalmente: reflected XSS por interpolar input sin escape.
  res.type('html').send(`<h1>Hello ${name}</h1><p>Try changing the name query param.</p>`);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Vulnerable intencionalmente: credenciales hardcodeadas y comparacion naive.
  if (username === 'admin' && password === 'admin123') {
    return res.json({ token: JWT_SIGNING_SECRET, role: 'admin' });
  }

  return res.status(401).json({ error: 'invalid credentials' });
});

app.get('/debug', (req, res) => {
  // Vulnerable intencionalmente: expone datos sensibles/configuracion interna.
  res.json({
    nodeEnv: process.env.NODE_ENV,
    pid: process.pid,
    cwd: process.cwd(),
    sampleSecret: STRIPE_SECRET_KEY,
    envPreview: Object.keys(process.env).slice(0, 10),
  });
});

app.get('/redirect', (req, res) => {
  // Vulnerable intencionalmente: open redirect.
  const target = req.query.url || '/';
  res.redirect(target);
});

app.get('/admin', (req, res) => {
  // Vulnerable intencionalmente: falta autorizacion real.
  res.json({ area: 'admin', message: 'No auth check here. This should not be public.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message, stack: err.stack });
});

async function start() {
  await initDb();
  app.listen(port, () => {
    console.log(`DevSecOps lab app listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = app;
