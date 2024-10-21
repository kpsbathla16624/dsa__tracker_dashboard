import { Router } from 'express';
import getCodeforcesprofile from '../controllers/CodeChefController';


 const codeChefRouter = Router();

 codeChefRouter.get('/getCodeChefprofile',getCodeforcesprofile);

 export default codeChefRouter;