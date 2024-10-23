// routes/index.ts
import { Router } from 'express';
import userrouter from './authRoutes';

import leetcoderouter from './leetcodeRoutes';
import CoderforcesRouter from './codeforcesRoutes';
import codeChefRouter from './codechefRouter';
import combinedDataRouter from './questionRoutes';

const router = Router();

// Use authentication routes
router.use('/auth', userrouter); // This will prefix all auth routes

router.use('/heatmap', combinedDataRouter ); 
router.use('/leetcode',leetcoderouter);
router.use('/codeforces',CoderforcesRouter);
router.use('/codechef',codeChefRouter);
export default router;
