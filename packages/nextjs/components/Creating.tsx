import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Creating() {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [currentOption, setCurrentOption] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);

  const { writeContractAsync: createPoll, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const addOption = () => {
    const trimmedOption = currentOption.trim();
    if (trimmedOption) {
      setOptions(prev => [...prev, trimmedOption]);
      setCurrentOption("");
    }
  };

  const handleSubmit = async () => {
    if (question && options.length > 1 && duration > 0) {
      try {
        await createPoll({
          functionName: "createPoll",
          args: [question, options, BigInt(duration)],
        });
        setQuestion("");
        setOptions([]);
        setDuration(0);
      } catch (error) {
        console.error("Error creating poll:", error);
      }
    } else {
      alert("Please complete all fields correctly.");
    }
  };

  return (
    <section className="bg-gray-50 p-5 rounded-md shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">New Poll</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Poll Question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add an Option"
            value={currentOption}
            onChange={e => setCurrentOption(e.target.value)}
            className="flex-1 border rounded p-2 focus:outline-none focus:ring"
          />
          <button onClick={addOption} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Add
          </button>
        </div>
        <ul className="list-disc pl-5 space-y-2">
          {options.map((opt, idx) => (
            <li key={idx} className="text-gray-700">
              {opt}
            </li>
          ))}
        </ul>
        <input
          type="number"
          placeholder="Duration in Seconds"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          className="w-full border rounded p-2 focus:outline-none focus:ring"
        />
        <button
          onClick={handleSubmit}
          disabled={isMining}
          className={`w-full p-2 rounded text-white ${isMining ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
        >
          {isMining ? "Creating..." : "Create Poll"}
        </button>
      </div>
    </section>
  );
}
