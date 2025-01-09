// routes/index.ts
import { Router } from 'express';
import userrouter from './authRoutes';

import leetcoderouter from './leetcodeRoutes';
import CoderforcesRouter from './codeforcesRoutes';
import codeChefRouter from './codechefRouter';
import combinedDataRouter from './questionRoutes';
import axios from 'axios';

const router = Router();

// Use authentication routes
router.use('/auth', userrouter); // This will prefix all auth routes

router.use('/heatmap', combinedDataRouter ); 
router.use('/leetcode',leetcoderouter);
router.use('/codeforces',CoderforcesRouter);
router.use('/codechef',codeChefRouter);
router.get("/gfgdata", async (req, res) => {
    try {
      const url = "https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=kamalprevsv1";
      const response = await axios .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      res.json(response.data); // Forward the data to your frontend
    } catch (error : any) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });
  
export default router;
