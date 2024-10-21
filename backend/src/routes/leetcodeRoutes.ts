import { Router } from 'express';
import leetcodeProfileController from '../controllers/leetcodeController';

 const leetcoderouter = Router();

 leetcoderouter.get('/getLeetcodeProfile',leetcodeProfileController);

 export default leetcoderouter;