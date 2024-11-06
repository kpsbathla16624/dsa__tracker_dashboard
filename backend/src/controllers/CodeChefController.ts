import axios from "axios";
import getCodechefSolvedCount from "../middleware/codechefTotal";

export default async function getCodeforcesprofile(req:any,res:any) {
   try {
    const {username} = req.query;
    const codechefdata =  await axios.get(`https://codechef-api-five.vercel.app/handle/${username}`);
    const count = await getCodechefSolvedCount(username);
    if (codechefdata.status == 200  ) {
        codechefdata.data.total = count;
        res.status(200).json(codechefdata.data);
    }
    else{
        res.status(400).json({"message":"user not found"});
    }
   } catch (error) {
    res.status(500).json({"message":"server error"})
   }

}