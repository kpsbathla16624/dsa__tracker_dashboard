// server.ts (or your main server file)
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes'; // Ensure this path is correct

dotenv.config();

async function start() {
    try {
        const app = express();
        
        // Connect to MongoDB using Mongoose
        await mongoose.connect(process.env.MONGO_URL ?? '');

        // Middleware to parse JSON requests
        app.use(express.json({ limit: '1000kb' }));

        // Use your router for handling routes
        app.use('/api', router); // Make sure your router handles this prefix

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

start();
