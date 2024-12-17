import axios from "axios";

export default async function leetcodeProfileController(req: any, res: any) {
  try {
    const { username } = req.query;

    // Check if username is provided
    if (!username) {
      return res.status(400).json({ message: "Username is required" }); // Use 'return' to stop further execution
    }


    // Fetch data from the LeetCode API
    const leetcodeResponse = await axios.get(
      `https://leetcodeapi-bolt.vercel.app/userProfile/${username}`
    );

    // If the response is successful, send data
    if (leetcodeResponse.status === 200) {
      return res.status(200).json(leetcodeResponse.data); // Return the response
    } else {
      return res.status(400).json({ message: "Details not found" }); // Handle non-200 status
    }
  } catch (error) {
    console.error("Error fetching LeetCode profile:", error); // Log error for debugging
    return res.status(500).json({ message: "Server error" }); // Handle server errors
  }
}
