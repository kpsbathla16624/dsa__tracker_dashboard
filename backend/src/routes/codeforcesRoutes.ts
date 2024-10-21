import { Router } from 'express';
import CodeforcesProfile from '../controllers/codeforcesController';


 const CoderforcesRouter = Router();

 CoderforcesRouter.get('/getCodeforcesprofile',CodeforcesProfile);

 export default CoderforcesRouter;