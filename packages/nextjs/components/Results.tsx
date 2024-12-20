import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function Results() {
  const [pollId, setPollId] = useState<number | null>(null);

  const { data: results } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getResults",
    args: [pollId !== null ? BigInt(pollId) : undefined],
  });

  return (
    <section className="bg-gray-100 p-5 rounded-md shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Poll Results</h2>
      <div className="space-y-4">
        <input
          type="number"
          placeholder="Enter Poll ID"
          onChange={e => setPollId(e.target.value !== "" ? Number(e.target.value) : null)}
          className="w-full border rounded p-2 focus:outline-none focus:ring"
        />
        {results ? (
          <div className="bg-white p-4 rounded-md shadow-md">
            <ul className="space-y-2">
              {results[0].map((option: string, idx: number) => (
                <li key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded shadow">
                  <span className="text-gray-700 font-medium">{option}</span>
                  <span className="text-gray-900 font-bold">{Number(results[1][idx])} votes</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-500">No results available</p>
        )}
      </div>
    </section>
  );
}
