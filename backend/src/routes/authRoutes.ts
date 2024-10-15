// routes/authRoutes.ts
import { Router } from 'express';
import { GetUserById, loginUser,registerUser } from '../controllers/userContoller';
import { authenticateJWT } from '../middleware/authenticateJWT';
import { AddprofileTOUser } from '../controllers/ProfileContoller';

const userrouter = Router();

// User registration route
userrouter.post('/login', loginUser );
userrouter.post('/register', registerUser);
userrouter.get('/authenticate', authenticateJWT, (req:any, res:any) => {
    res.json({
        message: 'user authenticated',
        user: req.user, // User info from the JWT
    });
});
userrouter.get('/getuserbyId',GetUserById);
userrouter.post('/addProfiles',AddprofileTOUser);


export default userrouter;
