import sqlite3 from "sqlite3";
import { initRecipes, initUsers } from "./dbQueries.js";

sqlite3.verbose();

const dbName = process.env.DB_NAME;

// Promisifying methods
function dbRun(db, sql, okMessage) {
  return new Promise((resolve, rej) => {
      db.run(
        sql,
        (e) => {
          if (e) rej(e);
          else {
            console.log(okMessage)
            resolve();
          };
        }
      );
    })
}

// Open-Close db wrapper
function useDb(callback) {
  return function () {
    const db = new sqlite3.Database(dbName, async(e) => {
      if (e) {
        console.log(e.message);
        return;
      }

      await callback(db);
      db.close();
    });
  }
}

export const dbInit = useDb(async (db) => {
  try {
    console.log("Connected to database");

    await dbRun(db, initRecipes, "Table recipes created or existed");
    
    await dbRun(db, initUsers, "Table users created or existed");
  } catch(e) { console.log(e) }
});