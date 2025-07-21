const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../lesson-data/lesson_select-basics.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT * FROM employees", (err, rows) => {
  if (err) console.error('SQLite test failed:', err);
  else console.log('SQLite test successful:', rows.length, 'rows found');
  db.close();
});