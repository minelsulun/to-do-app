import express from 'express';
import cors from 'cors';
import * as fs from "node:fs";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/mylist', (req, res) => {

    let taskData = fs.readFileSync('./data.json','utf-8');
    let tasks = JSON.parse(taskData);

    res.json(tasks)
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/mylist', (req, res) => {
    let taskData = fs.readFileSync('./data.json','utf-8');
    let tasks = JSON.parse(taskData);

    // Assuming req.body contains the new task to be added
    const newTask = {
        ...req.body,
        done: false,  // <-- Burada ekliyoruz
        id: tasks.data.length +1
    };
    // Add the new task to the tasks array
    tasks.data.push(newTask);

    // Write the updated tasks back to the file
    fs.writeFileSync('./data.json', JSON.stringify(tasks, null, 2));

    res.status(201).json(newTask);
})

app.put('/mylist', (req, res) => {
    let taskData = fs.readFileSync('./data.json','utf-8');
    let tasks = JSON.parse(taskData);

    // Assuming req.body contains the updated task
    const updatedTask = req.body;

    // Find the index of the task to update
    const index = tasks.data.findIndex((task:{text:string,id:number,done:boolean}) => task.id === updatedTask.id);

    if (index !== -1) {
        // Update the task
        tasks.data[index] = updatedTask;

        // Write the updated tasks back to the file
        fs.writeFileSync('./data.json', JSON.stringify(tasks, null, 2));

        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
})

app.delete('/mylist/:id', (req, res) => {
    const taskData = fs.readFileSync('./data.json', 'utf-8');
    const tasks = JSON.parse(taskData);

    const taskId = parseInt(req.params.id);

    const index = tasks.data.findIndex(task => task.id == taskId);

    if (index !== -1) {
        const deletedTask = tasks.data.splice(index, 1)[0];

        fs.writeFileSync('./data.json', JSON.stringify(tasks, null, 2));
        res.json(deletedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});