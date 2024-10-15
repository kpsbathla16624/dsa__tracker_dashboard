import { Router } from 'express';
import { AddQuestion, getAllQuestions } from '../controllers/questionController';

 const questionRouter = Router();

 questionRouter.get('/allQuestions',getAllQuestions);
 questionRouter.post('/postQuestion',AddQuestion);

 export default questionRouter;
