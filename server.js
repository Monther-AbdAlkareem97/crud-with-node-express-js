const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/employeesDB')
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

// Create a schema and model for users
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    id: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', userSchema);

// GET: Fetch all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            res.status(404).send("No users found");
            return;
        }
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// POST: Add a new user
app.post('/users', async (req, res) => {
    const { id, name, age } = req.body;

    try {
        // Check if the user already exists
        const findUser = await User.findOne({ id });
        if (findUser) {
            res.status(400).send("User already exists");
            return;
        }

        // Create and save a new user
        const newUser = new User({ id, name, age });
        await newUser.save();

        res.status(201).send('User added successfully');
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// PUT: Update an existing user
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age } = req.body;

    try {
        // Find and update the user by id
        const user = await User.findOneAndUpdate({ id }, { name, age }, { new: true });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        res.status(200).send("User updated successfully");
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// DELETE: Delete a user by id
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOneAndDelete({ id });
        if (!user) {
            res.status(400).send("User not found");
            return;
        }

        res.status(200).send('User deleted successfully');
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
