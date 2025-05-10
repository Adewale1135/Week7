const express = require('express');
const mongoose = require('mongoose');
const Item = require('./models/item'); // Ensure the path matches your file structure
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lost-and-found', { useNewUrlParser: true, useUnifiedTopology: true });

// **Add a found item**
app.post('/items', async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// **View all unclaimed items**
app.get('/items/unclaimed', async (req, res) => {
    try {
        const items = await Item.find({ claimed: false });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **View one item by ID**
app.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **Update an item’s details or mark as claimed**
app.put('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// **Delete old/irrelevant entries**
app.delete('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
