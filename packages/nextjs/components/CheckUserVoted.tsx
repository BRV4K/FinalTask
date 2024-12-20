import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function CheckUserVoted({ pollId }: { pollId: bigint }) {
  const [userAddress, setUserAddress] = useState<string>("");

  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "hasUserVoted",
    args: [pollId, userAddress],
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  if (hasVoted === undefined) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="p-4 bg-gray-200 text-black rounded-md shadow-md max-w-md mx-auto text-center">
      {hasVoted ? (
        <p className="text-lg font-medium text-green-600">You have already voted in this poll.</p>
      ) : (
        <p className="text-lg font-medium text-red-600">You have not yet voted in this poll.</p>
      )}
    </div>
  );
}
