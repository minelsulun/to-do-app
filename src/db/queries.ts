import { db } from "./main";

// İlk tablo oluşturma (priority dahil)
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         text TEXT NOT NULL,
                                         done BOOLEAN NOT NULL DEFAULT 0,
                                         priority TEXT NOT NULL DEFAULT 'medium'
    )
`);

// Eğer daha önce oluşturulmuşsa priority kolonu yok olabilir — güvenli kontrol (isteğe bağlı)
try {
    db.prepare(`ALTER TABLE tasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium'`).run();
} catch (e) {
    // Sütun zaten varsa hata verir, bunu sessizce geç
}


export const getAllTasksQuery = () => {
    return db.prepare(`
        SELECT * FROM tasks
        ORDER BY
            CASE priority
                WHEN 'high' THEN 1
                WHEN 'medium' THEN 2
                WHEN 'low' THEN 3
                ELSE 4
                END,
            id DESC;
    `).all();
};

export const getDoneTasksQuery = () => {
    return db.prepare(`SELECT * FROM tasks WHERE done = 1`).all();
};

export const getUndoneTasksQuery = () => {
    return db.prepare(`SELECT * FROM tasks WHERE done = 0`).all();
};

export const searchTasksQuery = (term: string) => {
    return db.prepare(`SELECT * FROM tasks WHERE LOWER(text) LIKE ?`)
        .all(`%${term.toLowerCase()}%`);
};

export const addTask = (text: string, priority: string = "medium") => {
    const stmt = db.prepare(`INSERT INTO tasks (text, done, priority) VALUES (?, 0, ?)`);
    const info = stmt.run(text, priority);
    return { id: info.lastInsertRowid, text, done: 0, priority };
};

export const updateTask = (id: number, text: string, done: boolean, priority: string) => {
    return db.prepare(`
        UPDATE tasks SET text = ?, done = ?, priority = ? WHERE id = ?
    `).run(text, done ? 1 : 0, priority, id);
};

export const deleteTask = (id: number) => {
    return db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id);
};