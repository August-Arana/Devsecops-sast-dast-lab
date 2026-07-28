const assert = require('node:assert');
const test = require('node:test');
const http = require('node:http');
const app = require('../src/server');
const { initDb } = require('../src/db');

function request(server, path) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const options = { hostname: '127.0.0.1', port: address.port, path, method: 'GET' };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body, headers: res.headers }));
    });

    req.on('error', reject);
    req.end();
  });
}

test('health endpoint returns ok', async () => {
  await initDb();
  const server = app.listen(0);

  try {
    const res = await request(server, '/health');
    assert.equal(res.statusCode, 200);
    assert.match(res.body, /"status":"ok"/);
  } finally {
    server.close();
  }
});

test('search endpoint returns seeded users', async () => {
  await initDb();
  const server = app.listen(0);

  try {
    const res = await request(server, '/search?q=alice');
    assert.equal(res.statusCode, 200);
    assert.match(res.body, /alice@demo\.local/);
  } finally {
    server.close();
  }
});
