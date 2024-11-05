import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/router';
import cors from 'cors';





dotenv.config();

async function start() {
    try {
        const app = express();
        
        app.use(cors({
            origin: 'https://dsa-tracker-dashboard-4ctx.vercel.app', // Allow requests only from your frontend's URL
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods if necessary
            credentials: true // Enable if your requests include credentials (cookies, etc.)
          }));
        await mongoose.connect(process.env.MONGO_URL ?? '');

        app.use(express.json({ limit: '1000kb' }));

        
        app.use('/api', router); 
        app.get('/', (req, res) => {
            res.send('Hello World');
        }
        );
        

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
       
      
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

start();
