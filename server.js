const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

let items = [];

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf8");
      items = JSON.parse(raw);
    } else {
      items = [
        { id: 1, name: "Learn Node.js" },
        { id: 2, name: "Build a small project" }
      ];
      saveData();
    }
  } catch (error) {
    console.error("Error loading data:", error);
    items = [];
  }
}


function saveData() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

loadData();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', "edit.html"));
});

app.get('/api/items', (req, res) => {
    res.json(items);
});

app.post('/api/items', (req, res) => {
    const name = req.body.name?.trim();
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    
    const newItem = {
        id: items.length ? items[items.length - 1].id + 1 : 1,
        name,
    };
    items.push(newItem);
    saveData();
    res.status(201).json(newItem);
});

app.post('/api/items/delete', (req, res) => {
    const id = Number(req.body.id);
    const before = items.length;
    items = items.filter(item => item.id !== id);
    if (items.length === before) {
        return res.status(404).json({ error: "Item not found" });
    }
    saveData();
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});