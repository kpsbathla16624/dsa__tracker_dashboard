import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes'; 


dotenv.config();

async function start() {
    try {
        const app = express();
        
      
        await mongoose.connect(process.env.MONGO_URL ?? '');

        app.use(express.json({ limit: '1000kb' }));

        
        app.use('/api', router); 

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
       
      
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

start();
