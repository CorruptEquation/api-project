import sqlite3 from "sqlite3";

sqlite3.verbose();

const dbName = "database.db";

export const db = new sqlite3.Database(dbName, (e) => {
  if (e) console.log(e.message);
  else {
    console.log("Connected to database");
    db.run(
      "CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)",
      (e) => {
        if (e) console.log(e.message);
        else console.log("Table recipes created or existed");
      }
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, password TEXT NOT NULL, APIToken TEXT NULL)",
      (e) => {
        if (e) console.log(e.message);
        else console.log("Table users created or existed");
      }
    );
  }
});
