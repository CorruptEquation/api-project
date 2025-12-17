import sqlite3 from "sqlite3";
import { initRecipes, initUsers } from "./dbQueries.js";

sqlite3.verbose();

const dbName = process.env.DB_NAME;

function useDb(callback) {
  return function () {
    const db = new sqlite3.Database(dbName, (e) => {
      if (e) {
        console.log(e.message);
        return;
      }

      callback(db, () => db.close());
    });
  }
}

export const dbInit = useDb(async (db, done) => {
  try {
    console.log("Connected to database");

    await new Promise((response, rej) => {
      db.run(
        initRecipes,
        (e) => {
          if (e) rej(e);
          else {
            console.log("Table recipes created or existed")
            response();
          };
        }
      );
    })
    
    await new Promise((response, rej) => {
      db.run(
        initUsers,
        (e) => {
          if (e) rej(e);
          else {
            console.log("Table users created or existed");
            response();
          }
        }
      );
    })

    done();
  } catch(e) { console.log(e) }
});