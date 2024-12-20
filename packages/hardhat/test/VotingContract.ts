import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { VotingContract } from "../typechain-types";

describe("PollManager Contract", function () {
  let pollManager: VotingContract;
  let deployer: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async () => {
    const pollManagerFactory = await ethers.getContractFactory("VotingContract");
    pollManager = await pollManagerFactory.deploy();
    await pollManager.waitForDeployment();

    [deployer, user1, user2] = await ethers.getSigners();
  });

  it("Should create a poll successfully", async () => {
    const answers = ["Option A", "Option B"];
    await pollManager.createPoll("Sample Question", answers, 3600);

    const poll = await pollManager.getPollDetails(0);
    expect(poll.question).to.equal("Sample Question");
    expect(poll.options).to.deep.equal(answers);
    expect(poll.isActive).to.equal(true);
    expect(poll.creator).to.equal(deployer.address);
  });

  it("Should reject poll creation with less than 2 options", async () => {
    await expect(pollManager.createPoll("Invalid Poll", ["Single Option"], 3600)).to.be.revertedWith(
      "There must be at least two possible answers",
    );
  });

  it("Should allow a user to cast a vote", async () => {
    await pollManager.createPoll("Voting Example", ["Option A", "Option B"], 3600);

    await pollManager.connect(user1).vote(0, 0);
    const hasVoted = await pollManager.hasUserVoted(0, user1.address);
    expect(hasVoted).to.equal(true);
  });

  it("Should prevent duplicate votes", async () => {
    await pollManager.createPoll("Duplicate Vote Check", ["Option A", "Option B"], 3600);

    await pollManager.connect(user1).vote(0, 0);
    await expect(pollManager.connect(user1).vote(0, 0)).to.be.revertedWith("You have already voted");
  });

  it("Should allow only the creator to close the poll", async () => {
    await pollManager.createPoll("Close Poll Example", ["Option A", "Option B"], 1);

    // Advance time to allow poll closure
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);

    await pollManager.endPoll(0);
    const poll = await pollManager.getPollDetails(0);
    expect(poll.isActive).to.equal(false);
  });

  it("Should prevent premature poll closure", async () => {
    await pollManager.createPoll("Early Closure", ["Option A", "Option B"], 3600);
    await expect(pollManager.endPoll(0)).to.be.revertedWith("Voting is still active");
  });

  it("Should return correct poll results", async () => {
    await pollManager.createPoll("Result Verification", ["Option A", "Option B"], 3600);
    await pollManager.connect(user1).vote(0, 0);
    await pollManager.connect(user2).vote(0, 1);

    // Advance time for poll closure
    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);

    await pollManager.endPoll(0);

    const results = await pollManager.getResults(0);
    expect(results.voteCounts[0]).to.equal(1n);
    expect(results.voteCounts[1]).to.equal(1n);
  });
});
