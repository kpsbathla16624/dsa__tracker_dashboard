import host from "../consts";

export default async function getUserProfile(
  codeChefUsername: string | null,
  codeForcesUsername: string | null,
  leetCodeUsername: string | null
) {
  try {
    // Create an array to hold fetch promises for valid usernames
    const fetchPromises: Promise<Response>[] = [];

    // Push valid fetch requests to the array
    if (codeChefUsername) {
      fetchPromises.push(fetch(`${host}/api/codechef/getCodeChefprofile?username=${codeChefUsername}`));
    }
    if (codeForcesUsername) {
      fetchPromises.push(fetch(`${host}/api/codeforces/getCodeforcesprofile?username=${codeForcesUsername}`));
    }
    if (leetCodeUsername) {
      fetchPromises.push(fetch(`${host}/api/leetcode/getLeetcodeProfile?username=${leetCodeUsername}`));
    }

    const responses = await Promise.all(fetchPromises);

    const errorMessages: string[] = [];
    const profiles: { codeChef: any; codeForces: any; leetCode: any } = {
      codeChef: { total: 0 },
      codeForces: { total: 0 },
      leetCode: { totalSolved: 0 },
    };

    // Use a for...of loop to handle async properly
    for (let index = 0; index < responses.length; index++) {
      const response = responses[index];
      if (response.ok) {
        const serviceName =
          index === 0 && codeChefUsername
            ? "codeChef"
            : index === 1 && codeForcesUsername
            ? "codeForces"
            : "leetCode";
        profiles[serviceName] = await response.json();
      } else {
        const serviceName =
          index === 0 && codeChefUsername
            ? "CodeChef"
            : index === 1 && codeForcesUsername
            ? "Codeforces"
            : "LeetCode";
        errorMessages.push(`${serviceName} profile fetch failed: ${response.statusText}`);
      }
    }

    if (leetCodeUsername) {
      profiles.leetCode.username = leetCodeUsername; // Assign username only if it exists
    }

    // If there are errors, throw them
    if (errorMessages.length > 0) {
      throw new Error(errorMessages.join("; "));
    }
    console.log(profiles);
    return profiles; // Return fetched profiles
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return { error: `Unable to fetch user profiles: ${(error as Error).message}` };
  }
}
