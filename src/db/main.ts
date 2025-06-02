import Database from "better-sqlite3"
import {databasePath} from "../../utils/paths";
import * as fs from "node:fs";

if(fs.existsSync(databasePath)){
    console.log("Database found. Opening...");
}else{
    console.log("Failed to open database. Creating a new one...");
    fs.writeFileSync(databasePath, '');
}
export const db = new Database(databasePath)