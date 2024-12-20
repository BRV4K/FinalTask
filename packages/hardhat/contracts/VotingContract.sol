// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Decentralized Voting System
 * @dev Enables poll creation, voting, and result management with tamper-proof mechanisms.
 */
contract DecentralizedVoting {
    string public constant platformMessage = "Empowering Transparent Decisions!";

    // Poll structure definition
    struct Poll {
        string title; // Poll question
        string[] answers; // List of options
        mapping(uint => uint) votes; // Vote tally per option
        mapping(address => bool) participants; // Track voters
        uint expiration; // Poll expiration timestamp
        bool active; // Poll activity status
        address owner; // Creator of the poll
    }

    // Array to store all polls
    Poll[] private allPolls;

    /**
     * @notice Creates a new poll.
     * @param _title The question for the poll.
     * @param _answers List of options for the poll.
     * @param _duration Poll duration in seconds.
     */
    function initiatePoll(string memory _title, string[] memory _answers, uint _duration) external {
        require(_answers.length > 1, "Provide at least two options.");
        require(_duration > 0, "Duration must be positive.");

        Poll storage newPoll = allPolls.push();
        newPoll.title = _title;
        newPoll.answers = _answers;
        newPoll.expiration = block.timestamp + _duration;
        newPoll.active = true;
        newPoll.owner = msg.sender;
    }

    /**
     * @notice Allows a user to vote on a poll.
     * @param _pollId The ID of the poll.
     * @param _optionIndex The index of the selected option.
     */
    function castVote(uint _pollId, uint _optionIndex) external {
        require(_pollId < allPolls.length, "Poll does not exist.");
        Poll storage selectedPoll = allPolls[_pollId];

        require(block.timestamp < selectedPoll.expiration, "Poll has ended.");
        require(selectedPoll.active, "Poll is inactive.");
        require(!selectedPoll.participants[msg.sender], "Already voted.");
        require(_optionIndex < selectedPoll.answers.length, "Invalid option.");

        selectedPoll.participants[msg.sender] = true;
        selectedPoll.votes[_optionIndex]++;
    }

    /**
     * @notice Ends a poll, making it inactive.
     * @param _pollId The ID of the poll.
     */
    function closePoll(uint _pollId) external {
        require(_pollId < allPolls.length, "Poll does not exist.");
        Poll storage poll = allPolls[_pollId];

        require(block.timestamp >= poll.expiration, "Poll is still active.");
        require(poll.active, "Poll already closed.");
        require(msg.sender == poll.owner, "Only the creator can close the poll.");

        poll.active = false;
    }

    /**
     * @notice Fetches poll results.
     * @param _pollId The ID of the poll.
     * @return answers List of options.
     * @return voteTallies Vote count for each option.
     */
    function retrieveResults(uint _pollId) external view returns (string[] memory answers, uint[] memory voteTallies) {
        require(_pollId < allPolls.length, "Poll does not exist.");
        Poll storage poll = allPolls[_pollId];

        answers = poll.answers;
        voteTallies = new uint[](poll.answers.length);

        for (uint i = 0; i < poll.answers.length; i++) {
            voteTallies[i] = poll.votes[i];
        }
    }

    /**
     * @notice Retrieves the total number of polls created.
     * @return The number of polls.
     */
    function totalPolls() external view returns (uint) {
        return allPolls.length;
    }

    /**
     * @notice Fetches poll details.
     * @param _pollId The ID of the poll.
     * @return title Poll question.
     * @return answers List of options.
     * @return expiration Poll expiration timestamp.
     * @return active Poll activity status.
     * @return owner Address of the poll creator.
     */
    function pollInfo(uint _pollId) external view returns (
        string memory title,
        string[] memory answers,
        uint expiration,
        bool active,
        address owner
    ) {
        require(_pollId < allPolls.length, "Poll does not exist.");
        Poll storage poll = allPolls[_pollId];
        return (poll.title, poll.answers, poll.expiration, poll.active, poll.owner);
    }

    /**
     * @notice Checks if a user has voted in a poll.
     * @param _pollId The ID of the poll.
     * @param _voter Address of the user.
     * @return True if the user has voted, otherwise false.
     */
    function hasVoted(uint _pollId, address _voter) external view returns (bool) {
        require(_pollId < allPolls.length, "Poll does not exist.");
        Poll storage poll = allPolls[_pollId];
        return poll.participants[_voter];
    }
}
