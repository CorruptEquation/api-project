import sqlite3 from "sqlite3";
import { initRecipesSQL, initUsersSQL, getUserSQL, insertUserSQL, getAPITkSQL, UpdateAPITkSQL } from "./dbQueries.js";

sqlite3.verbose();

const dbName = process.env.DB_PATH;

// Promisifying methods

function dbRun({db, sql, initMsg = undefined, params = []}) {
  return new Promise((resolve, rej) => {
      db.run(
        sql,
        params,
        (e) => {
          if (e) rej(e);
          else {
            initMsg && console.log(initMsg);
            resolve();
          };
        }
      );
    })
}

function dbGet({db, sql, params = []}) {
  return new Promise((resolve, rej) => {
      db.get(
        sql,
        params,
        (e, row) => { 
        if (e) rej(e);
        else resolve(row);
      });
    });
}

// Open-Close db wrapper
function useDb(callback) {
  return async function (params = undefined) {
    return new Promise((resolve, rej) => {
      const db = new sqlite3.Database(dbName, async (e) => {
        if (e) return rej(e); 

        try { resolve(await callback({db, params:Array.isArray(params)?params:[params]})); }
        catch(e) { rej(e); }
        finally { db.close(); }
      });
    });
  };
}

// Callbacks

export const dbInit = useDb(async ({db}) => {
  console.log("Connected to database");

  await dbRun({db, sql:initRecipesSQL, initMsg:"Table recipes created or existed"});
  
  await dbRun({db, sql:initUsersSQL, initMsg:"Table users created or existed"});
});

export const dbGetUser = useDb(async ({db, params}) => await dbGet({db, sql:getUserSQL, params}));
export const dbInsertUser = useDb(async ({db, params}) => await dbRun({db, sql:insertUserSQL, params}));
export const dbGetAPITk = useDb(async ({db, params}) => await dbGet({db, sql:getAPITkSQL, params}));
export const dbUpdateAPITk = useDb(async ({db, params}) => await dbRun({db, sql:UpdateAPITkSQL, params}));