
interface SubmissionProps {
  title: string;
  status: string;
  username: string;
  timestamp: string; // Keep this line
}

function Submission({ title, status, username, timestamp }: SubmissionProps) {
  return (
    <div className="h-52 text-white flex flex-col w-full p-4 border-b">
      <h1 className="text-xl font-semibold">{username}</h1>
      <p className="text-lg">{title}</p>
      <p className="text-sm">{status}</p>
      <p className="text-xs">{new Date(Number(timestamp) * 1000).toLocaleString()}</p> {/* Updated line */}
    </div>
  );
}

export default Submission;
