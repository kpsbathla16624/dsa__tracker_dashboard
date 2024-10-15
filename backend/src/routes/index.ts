// routes/index.ts
import { Router } from 'express';
import userrouter from './authRoutes';

const router = Router();

// Use authentication routes
router.use('/auth', userrouter); // This will prefix all auth routes
router.use('/auth', userrouter); // This will prefix all auth routes

export default router;
