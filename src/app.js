const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const users = require('./routes/users');
const uploads = require('./routes/uploads');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eventify', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/users', users);
app.use('/api/uploads', uploads);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 