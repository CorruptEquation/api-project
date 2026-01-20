// Debugging purposes

import sqlite3 from "sqlite3";

const db = new sqlite3.Database("database/database.db", sqlite3.OPEN_READONLY, err => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
});

db.all(
  "SELECT name FROM sqlite_master WHERE type='table';",
  (err, rows) => {
    if (err) throw err;
    console.log("Tables:", rows);

    const table = rows[2]?.name;
    if (!table) return db.close();

    db.all(`SELECT * FROM ${table} LIMIT 10`, (err, data) => {
      if (err) throw err;
      console.table(data);
      db.close();
    });
  }
);

