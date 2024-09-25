const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware for JSON parsing
app.use(bodyParser.json());

// Mock user data for now (later will be from a database)
const users = [];

// Secret key for JWT (should be stored in environment variables for production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find the user from the "users" array
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Register route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user (you'll use a database in the future)
    users.push({ email, password: hashedPassword });
    res.status(201).json({ message: 'User registered' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
