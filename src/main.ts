import express from 'express';
import cors from 'cors';
import {addTask, deleteTask, getAllTasksQuery, getDoneTasksQuery, getUndoneTasksQuery, updateTask} from "./db/queries";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

app.get('/mylist', (req, res) => {
    try {
        const tasks = getAllTasksQuery();
        console.log('Görevler:', tasks);
        res.json({ data: tasks });
    } catch (error) {
        console.error('DB hata:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ➕ Yeni görev ekleme
app.post('/mylist', (req, res) => {
    const { text } = req.body;
    const result = addTask(text);
        res.json(result);
});

// ✏️ Görev güncelleme
app.put('/mylist', (req, res) => {
    const { id, text, done } = req.body;
    const result = updateTask(id, text, done);

    if (result.changes === 1) {
        res.json({ id, text, done });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// ✅ Tamamlanan görevleri getir
app.get('/mylist/done', (req, res) => {
    const done = getDoneTasksQuery();
    res.status(200).json({ data: done });
});

// ⏳ Tamamlanmamış görevleri getir
app.get('/mylist/undone', (req, res) => {
    const undone = getUndoneTasksQuery();
    res.status(200).json({ data: undone });
});


// ❌ Görev silme
app.delete('/mylist/:id', (req, res) => {
    const id = Number(req.params.id);
    const result = deleteTask(id);

    if (result.changes === 1) {
        res.json({ message: 'Task deleted', id });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});