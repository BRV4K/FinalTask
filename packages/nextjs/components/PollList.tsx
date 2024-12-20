import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function PollList() {
  const { data: pollCount } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollCount",
  });

  const renderPolls = () => {
    if (!pollCount) return <p className="text-center text-gray-500">Loading polls...</p>;
    return Array.from({ length: Number(pollCount) }, (_, index) => <PollItem key={index} pollId={BigInt(index)} />);
  };

  return (
    <section className="bg-gray-100 p-5 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Active Polls</h2>
      {pollCount && pollCount > 0 ? (
        <div className="space-y-4">{renderPolls()}</div>
      ) : (
        <p className="text-center text-gray-600">No polls available</p>
      )}
    </section>
  );
}

function PollItem({ pollId }: { pollId: bigint }) {
  const { data: pollDetails } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollDetails",
    args: [pollId],
  });

  const { writeContractAsync: vote } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  if (!pollDetails) return <p className="text-center text-gray-500">Loading poll details...</p>;

  const [question, options, , isActive] = pollDetails;

  const handleVote = async (optionIndex: number) => {
    if (!isActive) {
      alert("Voting is already completed.");
      return;
    }
    try {
      await vote({
        functionName: "vote",
        args: [pollId, BigInt(optionIndex)],
      });
      alert(`You voted for option ${optionIndex + 1}`);
    } catch (error: any) {
      console.error("Vote failed:", error);
      alert(error.reason || "An error occurred while voting.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{question}</h3>
      <ul className="space-y-2">
        {options.map((option: string, idx: number) => (
          <li
            key={idx}
            onClick={() => handleVote(idx)}
            className={`flex justify-between items-center bg-gray-50 p-2 rounded shadow cursor-pointer ${
              isActive ? "hover:bg-blue-100" : "cursor-not-allowed opacity-50"
            }`}
          >
            <span className="text-gray-700 font-medium">{option}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm mt-2 text-gray-600">{isActive ? "Poll is active" : "Poll has ended"}</p>
    </div>
  );
}
