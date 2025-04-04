const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: '*' // In production, replace with your frontend URL
}));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + '.jpg');
    }
});

const upload = multer({ storage: storage });

// Endpoint to receive photos
app.post('/capture', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No photo uploaded' });
    }

    console.log(`Photo saved: ${req.file.filename}`);
    res.status(200).json({ message: 'Photo received successfully' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Photos will be saved to: ${uploadDir}`);
});