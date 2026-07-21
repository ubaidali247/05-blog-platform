const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3005;
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { posts: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Seed data if empty
function seedIfEmpty() {
  const db = readDB();
  if (db.posts.length === 0) {
    db.posts = [
    {
        "id": "seed-1",
        "title": "Getting Started with JavaScript",
        "description": "Sample description for Getting Started with JavaScript. This is test data for the flaky test detection research study.",
        "category": "Technology",
        "createdAt": "2026-07-21T00:21:18.597Z",
        "status": "draft"
    },
    {
        "id": "seed-2",
        "title": "Top Travel Destinations 2024",
        "description": "Sample description for Top Travel Destinations 2024. This is test data for the flaky test detection research study.",
        "category": "Travel",
        "createdAt": "2026-07-20T00:21:18.597Z",
        "status": "published"
    },
    {
        "id": "seed-3",
        "title": "Healthy Eating Guide",
        "description": "Sample description for Healthy Eating Guide. This is test data for the flaky test detection research study.",
        "category": "Food",
        "createdAt": "2026-07-19T00:21:18.597Z",
        "status": "archived"
    },
    {
        "id": "seed-4",
        "title": "Remote Work Tips",
        "description": "Sample description for Remote Work Tips. This is test data for the flaky test detection research study.",
        "category": "Lifestyle",
        "createdAt": "2026-07-18T00:21:18.597Z",
        "status": "draft"
    },
    {
        "id": "seed-5",
        "title": "Best Coffee Shops in Dublin",
        "description": "Sample description for Best Coffee Shops in Dublin. This is test data for the flaky test detection research study.",
        "category": "Business",
        "createdAt": "2026-07-17T00:21:18.597Z",
        "status": "published"
    },
    {
        "id": "seed-6",
        "title": "Learning to Code at 30",
        "description": "Sample description for Learning to Code at 30. This is test data for the flaky test detection research study.",
        "category": "Technology",
        "createdAt": "2026-07-16T00:21:18.597Z",
        "status": "archived"
    },
    {
        "id": "seed-7",
        "title": "Budget Travel in Europe",
        "description": "Sample description for Budget Travel in Europe. This is test data for the flaky test detection research study.",
        "category": "Travel",
        "createdAt": "2026-07-15T00:21:18.597Z",
        "status": "draft"
    },
    {
        "id": "seed-8",
        "title": "Home Workout Routine",
        "description": "Sample description for Home Workout Routine. This is test data for the flaky test detection research study.",
        "category": "Food",
        "createdAt": "2026-07-14T00:21:18.597Z",
        "status": "published"
    }
];
    writeDB(db);
  }
}
seedIfEmpty();

// GET all
app.get('/api/posts', (req, res) => {
  const db = readDB();
  let items = db.posts;
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    items = items.filter(i => i.title && i.title.toLowerCase().includes(q) || (i.name && i.name.toLowerCase().includes(q)));
  }
  if (req.query.category) {
    items = items.filter(i => i.category === req.query.category);
  }
  res.json(items);
});

// GET one
app.get('/api/posts/:id', (req, res) => {
  const db = readDB();
  const item = db.posts.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// POST create
app.post('/api/posts', (req, res) => {
  const db = readDB();
  const item = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
  db.posts.push(item);
  writeDB(db);
  res.status(201).json(item);
});

// PUT update
app.put('/api/posts/:id', (req, res) => {
  const db = readDB();
  const idx = db.posts.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.posts[idx] = { ...db.posts[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeDB(db);
  res.json(db.posts[idx]);
});

// DELETE
app.delete('/api/posts/:id', (req, res) => {
  const db = readDB();
  const idx = db.posts.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.posts.splice(idx, 1);
  writeDB(db);
  res.json({ message: 'Deleted successfully' });
});

// Reset endpoint for testing
app.post('/api/reset', (req, res) => {
  const initial = { posts: [] };
  writeDB(initial);
  seedIfEmpty();
  res.json({ message: 'Database reset' });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', project: 'Blog Platform' }));

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => console.log('Blog Platform server running on http://localhost:3005'));
