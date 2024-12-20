import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Ending({ pollId }: { pollId: bigint }) {
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const handleEndPoll = async () => {
    try {
      await writeContractAsync({
        functionName: "endPoll",
        args: [pollId],
      });
      alert("Poll ended successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while ending the poll.");
    }
  };

  return (
    <div className="p-4 bg-gray-200 text-black rounded-md shadow-md max-w-md mx-auto space-y-3">
      <p className="text-center text-gray-700">Are you sure you want to end this poll?</p>
      <button
        onClick={handleEndPoll}
        disabled={isMining}
        className={`w-full py-2 rounded ${isMining ? "bg-gray-400 text-gray-600" : "bg-red-500 text-white hover:bg-red-600 transition"}`}
      >
        {isMining ? "Ending..." : "End Poll"}
      </button>
    </div>
  );
}
