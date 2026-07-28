const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  const current = await all('SELECT COUNT(*) AS total FROM users');
  if (current[0].total > 0) return;

  await run('INSERT INTO users (username, email, role) VALUES (?, ?, ?)', ['admin', 'admin@demo.local', 'admin']);
  await run('INSERT INTO users (username, email, role) VALUES (?, ?, ?)', ['alice', 'alice@demo.local', 'developer']);
  await run('INSERT INTO users (username, email, role) VALUES (?, ?, ?)', ['bob', 'bob@demo.local', 'viewer']);
}

// Vulnerable intencionalmente: concatena input del usuario dentro del SQL.
async function searchUsersUnsafe(query) {
  const sql = "SELECT id, username, email, role FROM users WHERE username LIKE '%" + query + "%' OR email LIKE '%" + query + "%'";
  return all(sql);
}

// Version corregida para mostrar el contraste durante la clase.
async function searchUsersSafe(query) {
  const term = `%${query}%`;
  return all('SELECT id, username, email, role FROM users WHERE username LIKE ? OR email LIKE ?', [term, term]);
}

module.exports = {
  initDb,
  searchUsersUnsafe,
  searchUsersSafe,
};
