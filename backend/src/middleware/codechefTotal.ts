import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function getCodechefSolvedCount(username: string) {
  try {
    const response = await axios.get(`https://www.codechef.com/users/${username}`);
    const html = response.data;
    const $ = cheerio.load(html);

   
    const solvedProblemsText = $('.rating-data-section.problems-solved h3').text().trim();

    console.log(`Extracted text: ${solvedProblemsText}`);

  
    const solvedCountMatch = solvedProblemsText.match(/Total Problems Solved:\s*(\d+)/);
    const solvedCount = solvedCountMatch ? solvedCountMatch[1] : '0';

    console.log(`User ${username} has solved ${solvedCount} problems.`);
    return solvedCount; 
  } catch (error) { 
    console.error("Error fetching data from CodeChef:", error);
  }
}
