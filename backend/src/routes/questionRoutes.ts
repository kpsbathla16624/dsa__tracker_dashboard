import { Router } from 'express';
import getHeatMapdata, { AddQuestion, getAllQuestions } from '../controllers/questionController';

 const combinedDataRouter = Router();

 combinedDataRouter.get('/allQuestions',getAllQuestions);
 combinedDataRouter.post('/postQuestion',AddQuestion);
 combinedDataRouter.get('/getHeatmapData',getHeatMapdata);
 

 export default combinedDataRouter;
