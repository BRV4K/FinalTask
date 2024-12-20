"use client";

import { useEffect } from "react";
import Creating from "../components/Creating";
import PollList from "../components/PollList";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import Results from "~~/components/Results";

const Page: NextPage = () => {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      console.log("User connected:", address);
    }
  }, [isConnected, address]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Voting Platform</h1>
        <p className="text-gray-600">Create, view, and manage polls seamlessly</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create a Poll</h2>
          <Creating />
        </section>

        <section className="bg-white p-6 rounded-md shadow-md md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Active Polls</h2>
          <PollList />
        </section>

        <section className="bg-white p-6 rounded-md shadow-md md:col-span-3">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Poll Results</h2>
          <Results />
        </section>
      </div>
    </main>
  );
};

export default Page;
