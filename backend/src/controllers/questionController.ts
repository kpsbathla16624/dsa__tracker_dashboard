import mongoose from "mongoose";
import { Iquestion, status } from "../model/questionModel";
import c from "config";

export async function getAllQuestions(req: any, res: any) {
  try {
    const { id } = req.query;
    if (!id) {
        return res.status(404).json({message:"id is required"});
    }
    const db = mongoose.connection.db;

    // Check if the DB is available
    if (!db) {
      return res.status(500).json({ message: "Database connection failed" });
    }

    const collection = db.collection('Question_DB');

    // Query for all questions by userId
    const questions = await collection.find({ userId: id }).toArray();
    return res.status(200).json({data:questions});


  } catch (error) {
    return res.status(500).json("server error");
  }
}


export async function AddQuestion(req: any, res: any) {
    try {
      const { userId, name, QuestionNumber, platform, link, completedTime, status, remarks, code, category } = req.body;
  
      // Validate required fields
      if (!userId || !name || !QuestionNumber || !platform || !link || !status ) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Validate field types
      if (typeof userId !== 'string' ||
          typeof name !== 'string' ||
          typeof QuestionNumber !== 'string' ||
          typeof platform !== 'string' ||
          typeof link !== 'string' ||
          typeof status !== 'string' ||
          typeof category !== 'string') {
        return res.status(400).json({ message: "Invalid data types" });
      }
  
      // Validate status enum
      if (status !== 'pending' && status !== 'completed') {
        return res.status(400).json({ message: "Invalid status" });
      }
  
      // Prepare the question object based on Iquestion interface
      const newQuestion: Iquestion = {
        userId,
        name,
        QuestionNumber,
        platform,
        link,
        completedTime: completedTime || '',  // If completedTime is optional
        status: status as status,            // Cast to enum
        remarks: remarks || '',              // Default empty string if not provided
        code: code || '',                    // Default empty string if not provided
        category
      };
  
     
      const collection = mongoose.connection.db?.collection('Question_DB');
  
      const result = await collection?.insertOne(newQuestion);
  
      
      return res.status(201).json({ message: "Question added successfully", question: newQuestion });
  
    } catch (error) {
      console.error("Error adding question:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  export default async function getHeatMapdata(req: any, res: any) {
    try {
        const { codechefid, codeforcesid, leetcodeid } = req.query;
        
        const codechefresponse = await fetch(`https://codechef-api-five.vercel.app/handle/${codechefid}`);
        const codeforcesresponse = await fetch(`https://codeforces.com/api/user.status?handle=${codeforcesid}`);
        const leetcoderesponse = await fetch(`https://enchanting-freedom-production.up.railway.app/${leetcodeid}/calendar`);
        let codechefdata = [];
        if (codechefresponse.status === 404) {
          codechefdata = []
        }
        else{

          codechefdata = await codechefresponse.json();
        }
        const codeforcesdata = await codeforcesresponse.json();
        const leetcodedata = await leetcoderesponse.json();
        
        const data = {
            leetcode: leetcodedata,
            codechef: codechefdata,
            codeforces: codeforcesdata
        };
       
        
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching heatmap data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}