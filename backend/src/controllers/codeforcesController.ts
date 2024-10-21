import axios from "axios";

// Define interfaces for the API responses
interface Problem {
    contestId: number;
    index: string;
    name: string;
    type: string;
    points: number;
    tags: string[];
}

interface Submission {
    contestId: number;
    problem: Problem;
    verdict: string;
}

interface UserInfo {
    handle: string;
    rating: number | null; // rating can be null for some users
    rank: string;
    maxRank: string;
    maxRating: number | null;
    total: number; 
    tagcount: Record<string, number>;
}

interface CodeforcesUserResponse {
    result: UserInfo[];
}

interface CodeforcesSubmissionsResponse {
    result: Submission[];
}

export default async function CodeforcesProfile(req: any, res: any) {
    try {
        const { username } = req.query;

        // Get user info
        const userInfoResponse = await axios.get<CodeforcesUserResponse>(
            `https://codeforces.com/api/user.info?handles=${username}`
        );
        const userInfo = userInfoResponse.data.result;

        if (userInfoResponse.status !== 200 || userInfo.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        // Get user submissions
        const submissionsResponse = await axios.get<CodeforcesSubmissionsResponse>(
            `https://codeforces.com/api/user.status?handle=${username}&count=10000`
        );
        const submissions = submissionsResponse.data.result;

        // Filter out submissions with a successful verdict
        const solvedSubmissions = submissions.filter(
            (submission: Submission) => submission.verdict === "OK"
        );

        // Create a unique set of problems
        const uniqueProblems = new Set<string>(
            solvedSubmissions.map((submission: Submission) => {
                const { problem } = submission;
                return `${problem.contestId}-${problem.name}-${problem.index}`;
            })
        );

        userInfo[0].total = uniqueProblems.size;
        const tagCounts: Record<string, number> = {}; // Initialize an object to hold tag counts

        // Iterate through each submission to count tags
        solvedSubmissions.forEach((submission: Submission) => {
            const tags = submission.problem.tags || []; // Make sure to handle undefined tags

            tags.forEach((tag: string) => {
                // If the tag is already in the tagCounts object, increment its count
                if (tagCounts[tag]) {
                    tagCounts[tag]++;
                } else {
                    // Otherwise, initialize it with a count of 1
                    tagCounts[tag] = 1;
                }
            });
        });

        // Optionally, attach tagCounts to the userInfo response if needed
        userInfo[0].tagcount = tagCounts;

        res.status(200).json(userInfo[0]);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Server error" });
    }
}
