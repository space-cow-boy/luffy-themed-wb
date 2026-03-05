require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS — only allow requests from our frontend origin
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection error:', err));
