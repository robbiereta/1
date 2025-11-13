const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'fibro-data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ entries: [] }, null, 2));
  }
}

// Read data from file
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { entries: [] };
  }
}

// Write data to file
async function writeData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

// API Routes

// Get all entries
app.get('/api/entries', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve entries' });
  }
});

// Get single entry by ID
app.get('/api/entries/:id', async (req, res) => {
  try {
    const data = await readData();
    const entry = data.entries.find(e => e.id === req.params.id);
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve entry' });
  }
});

// Create new entry
app.post('/api/entries', async (req, res) => {
  try {
    const data = await readData();
    const newEntry = {
      id: Date.now().toString(),
      date: req.body.date || new Date().toISOString().split('T')[0],
      pain: req.body.pain || 0,
      fatigue: req.body.fatigue || 0,
      brainFog: req.body.brainFog || 0,
      sleep: req.body.sleep || 0,
      mood: req.body.mood || 0,
      painAreas: req.body.painAreas || [],
      medications: req.body.medications || [],
      triggers: req.body.triggers || [],
      notes: req.body.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.entries.push(newEntry);
    await writeData(data);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// Update entry
app.put('/api/entries/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.entries.findIndex(e => e.id === req.params.id);
    if (index !== -1) {
      data.entries[index] = {
        ...data.entries[index],
        ...req.body,
        id: req.params.id,
        updatedAt: new Date().toISOString()
      };
      await writeData(data);
      res.json(data.entries[index]);
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// Delete entry
app.delete('/api/entries/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.entries.findIndex(e => e.id === req.params.id);
    if (index !== -1) {
      data.entries.splice(index, 1);
      await writeData(data);
      res.json({ message: 'Entry deleted successfully' });
    } else {
      res.status(404).json({ error: 'Entry not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const data = await readData();
    const entries = data.entries;

    if (entries.length === 0) {
      return res.json({
        totalEntries: 0,
        averages: {},
        recentTrends: []
      });
    }

    const averages = {
      pain: entries.reduce((sum, e) => sum + (e.pain || 0), 0) / entries.length,
      fatigue: entries.reduce((sum, e) => sum + (e.fatigue || 0), 0) / entries.length,
      brainFog: entries.reduce((sum, e) => sum + (e.brainFog || 0), 0) / entries.length,
      sleep: entries.reduce((sum, e) => sum + (e.sleep || 0), 0) / entries.length,
      mood: entries.reduce((sum, e) => sum + (e.mood || 0), 0) / entries.length
    };

    // Get last 30 days of data for trends
    const recentEntries = entries.slice(-30);

    res.json({
      totalEntries: entries.length,
      averages,
      recentTrends: recentEntries
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

// Export data
app.get('/api/export', async (req, res) => {
  try {
    const data = await readData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=fibro-tracker-export.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
initDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Fibromyalgia Tracker running on http://localhost:${PORT}`);
  });
});
