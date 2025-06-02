import {db} from "./main";

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT 0
    )
`);
export const getAllTasksQuery= () => {
    return db.prepare(`
        select * from tasks;
    `).all();
};

export const  getDoneTasksQuery = () => {
    return db.prepare(`select * from tasks where done = 1;
    `).all();
};
export const getUndoneTasksQuery = () => {
    return db.prepare(`select * from tasks where done = 0;
    `).all();
};

export const addTask = (text: string) => {
    const stmt = db.prepare('INSERT INTO tasks (text, done) VALUES (?, 0)');
    const info = stmt.run(text);
    return { id: info.lastInsertRowid, text, done: 0 };
};

export const updateTask = (id: number, text: string, done: boolean) => {
    return db.prepare('UPDATE tasks SET text = ?, done = ? WHERE id = ?').run(text, done ? 1 : 0, id);
};

export const deleteTask = (id: number) => {
    return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
};

