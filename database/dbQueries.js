export const initRecipesSQL = "CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)";
export const initUsersSQL = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, password TEXT NOT NULL, APIToken TEXT NULL)";
export const getUserSQL = "SELECT * FROM users WHERE email=?";
export const insertUserSQL = "INSERT INTO users (email, password) VALUES (?, ?)";
export const getAPITkSQL = "SELECT APIToken FROM users WHERE email=?";
export const UpdateAPITkSQL = "UPDATE users SET APIToken = ? WHERE email = ?";
export const deleteUserSQL = "DELETE FROM users WHERE email=?";