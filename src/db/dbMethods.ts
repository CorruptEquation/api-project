import sqlite3 from "sqlite3";
import { initRecipesSQL, initUsersSQL, getUserSQL, insertUserSQL, getAPITkSQL, UpdateAPITkSQL, deleteUserSQL } from "./dbQueries.js";

import { DbUser } from "../routes/AuthRouter.js";

sqlite3.verbose();

const dbName = process.env.DB_PATH!;

// Promisifying methods

type paramsType = undefined | readonly [string] | [string, string];

interface paramsDbType {
  params?: paramsType;
  db: sqlite3.Database;
}

interface promiMethodsType extends paramsDbType {
  sql: string;
}

function dbRun({ db, sql, msg, params }:
			   promiMethodsType & { msg?: string }):
			   Promise<void>
{
  return new Promise<void>((resolve, rej) => {
      db.run(
        sql,
        params,
        (e: Error) => {
          if (e) rej(e);
          else {
            msg && console.log(msg);
            resolve();
          };
        }
      );
    })
}

function dbGet<T>({ db, sql, params }:
				  promiMethodsType):
				  Promise<T | undefined>
{
  return new Promise<T | undefined>((resolve, rej) => {
      db.get(
        sql,
        params,
        (e: Error, row: T | undefined) => { 
        if (e) rej(e);
        else resolve(row);
      });
    });
}

// Open-Close db wrapper

function useDb(
  callback: ({ db }: {db:sqlite3.Database}) => Promise<void> 
): () => Promise<void>;

function useDb<T>(
  callback: ({ db, params }: paramsDbType) => Promise<T | undefined> 
): (params: paramsType) => Promise<T | undefined>;

function useDb<T>(
  callback: ({ db, params }: paramsDbType) => Promise<T | undefined | void>
) {
  return async function (params?: paramsType): Promise<T | undefined | void> {
    return new Promise((resolve, rej) => {
      const db = new sqlite3.Database(dbName, async (e) => {
        if (e) return rej(e);

        try { resolve(await callback({ db, params })); }
        catch(e) { rej(e); }
        finally { db.close(); }
      });
    });
  };
}

// Callbacks

interface APITokenType {
  APIToken?: string
}

export const dbInit = useDb(async ({db}) => {
  console.log("Connected to database");

  await dbRun({db, sql:initRecipesSQL, msg:"Table recipes created or existed"});
  
  await dbRun({db, sql:initUsersSQL, msg:"Table users created or existed"});
});

export const dbGetUser = (email: string): Promise<DbUser | undefined>  => 
  useDb<DbUser>(({ db, params }) => dbGet<DbUser>({ db, sql:getUserSQL, params }))([email]);

export const dbInsertUser = (email: string, pw: string): Promise<void> =>
  useDb(({ db, params }: paramsDbType) => dbRun({ db, sql:insertUserSQL, params }))([email, pw]);

export const dbGetAPITk = (email: string): Promise<APITokenType | undefined> =>
  useDb<APITokenType>(({ db, params }: paramsDbType) => dbGet({ db, sql:getAPITkSQL, params }))([email]);

export const dbUpdateAPITk = (email: string, newAPITk: string): Promise<void> =>
  useDb(({ db, params }: paramsDbType) => dbRun({ db, sql:UpdateAPITkSQL, params }))([email, newAPITk]);

export const dbRemUser = (email: string) =>
  useDb(({ db, params }: paramsDbType) => dbRun({ db, sql:deleteUserSQL, params }))([email]);
