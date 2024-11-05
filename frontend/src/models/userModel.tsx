 export default interface User {
    _id?: string;
    name: string;
    email: string;
    leetcode: string | null;
    codeforces: string | null;
    codechef: string | null;
    tagCounts: Record<string, number>;
  }