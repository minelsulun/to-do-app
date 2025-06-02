import * as path from "node:path";


export const databasePath = path.join(__dirname, '..', process.env.DB_NAME || 'database.sqlite');

