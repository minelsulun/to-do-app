import express, { Request, Response } from 'express';
import cors from 'cors';
import {
    addTask,
    deleteTask,
    getAllTasksQuery,
    getDoneTasksQuery,
    getUndoneTasksQuery,
    searchTasksQuery,
    updateTask
} from "./db/queries";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

// 🔍 Tüm görevleri getir veya arama yap
app.get('/mylist', (req: Request, res: Response) => {
    try {
        const search = req.query.search as string | undefined;
        const data = search ? searchTasksQuery(search) : getAllTasksQuery();
        res.status(200).json({ data });
    } catch (error) {
        console.error("❌ Error fetching tasks:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ➕ Yeni görev ekle
app.post('/mylist', (req: Request, res: Response) => {
    try {
        const { text, priority = 'medium' } = req.body;
        if (!text) return res.status(400).json({ message: "Text is required" });

        const result = addTask(text, priority);
        res.status(201).json(result);
    } catch (error) {
        console.error("❌ Error adding task:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✏️ Görev güncelle
app.put('/mylist', (req: Request, res: Response) => {
    try {
        const { id, text, done, priority = 'medium' } = req.body;
        const result = updateTask(id, text, done, priority);

        if (result.changes === 1) {
            res.json({ id, text, done, priority });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error("❌ Error updating task:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Tamamlanan görevleri getir
app.get('/mylist/done', (_req: Request, res: Response) => {
    try {
        const done = getDoneTasksQuery();
        res.status(200).json({ data: done });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ⏳ Tamamlanmamış görevleri getir
app.get('/mylist/undone', (_req: Request, res: Response) => {
    try {
        const undone = getUndoneTasksQuery();
        res.status(200).json({ data: undone });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ❌ Görev sil
app.delete('/mylist/:id', (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = deleteTask(id);

        if (result.changes === 1) {
            res.json({ message: 'Task deleted', id });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

