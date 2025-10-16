// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreditPassport
 * @dev A smart contract for managing user credit scores on-chain
 * @notice This contract allows the owner to update and retrieve user credit scores
 */
contract CreditPassport is Ownable {
    
    /**
     * @dev Struct to store user credit score information
     * @param user The address of the user
     * @param score The credit score value (0-1000)
     * @param lastUpdated The timestamp of the last score update
     */
    struct UserScore {
        address user;
        uint256 score;
        uint256 lastUpdated;
    }
    
    /**
     * @dev Mapping from user address to their credit score data
     */
    mapping(address => UserScore) private _userScores;
    
    /**
     * @dev Event emitted when a user's credit score is updated
     * @param user The address of the user whose score was updated
     * @param score The new credit score
     * @param timestamp The timestamp of the update
     */
    event ScoreUpdated(address indexed user, uint256 score, uint256 timestamp);
    
    /**
     * @dev Constructor that sets the contract deployer as the initial owner
     */
    constructor() Ownable(msg.sender) {
        // Ownable constructor is called automatically
    }
    
    /**
     * @dev Updates the credit score for a specific user (only callable by owner)
     * @param user The address of the user to update
     * @param score The new credit score (should be between 0-1000)
     * @notice Score of 0 means no score has been set
     */
    function updateScore(address user, uint256 score) external onlyOwner {
        require(user != address(0), "CreditPassport: Invalid user address");
        require(score <= 1000, "CreditPassport: Score must be <= 1000");
        
        _userScores[user] = UserScore({
            user: user,
            score: score,
            lastUpdated: block.timestamp
        });
        
        emit ScoreUpdated(user, score, block.timestamp);
    }
    
    /**
     * @dev Retrieves the current credit score and last update timestamp for a user
     * @param user The address of the user to query
     * @return score The current credit score (0 if no score exists)
     * @return lastUpdated The timestamp of the last score update (0 if no score exists)
     */
    function getScore(address user) external view returns (uint256 score, uint256 lastUpdated) {
        UserScore memory userScore = _userScores[user];
        return (userScore.score, userScore.lastUpdated);
    }
    
    /**
     * @dev Checks if a user has a credit score
     * @param user The address of the user to check
     * @return hasScore Boolean indicating if the user has a score
     */
    function hasScore(address user) external view returns (bool) {
        return _userScores[user].lastUpdated > 0;
    }
    
    /**
     * @dev Gets the complete UserScore struct for a user
     * @param user The address of the user to query
     * @return userScore The complete UserScore struct
     */
    function getUserScore(address user) external view returns (UserScore memory) {
        return _userScores[user];
    }
    
    /**
     * @dev Batch update scores for multiple users (only callable by owner)
     * @param users Array of user addresses
     * @param scores Array of corresponding scores
     * @notice Arrays must have the same length
     */
    function batchUpdateScores(address[] calldata users, uint256[] calldata scores) external onlyOwner {
        require(users.length == scores.length, "CreditPassport: Arrays length mismatch");
        require(users.length > 0, "CreditPassport: Empty arrays");
        
        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != address(0), "CreditPassport: Invalid user address");
            require(scores[i] <= 1000, "CreditPassport: Score must be <= 1000");
            
            _userScores[users[i]] = UserScore({
                user: users[i],
                score: scores[i],
                lastUpdated: block.timestamp
            });
            
            emit ScoreUpdated(users[i], scores[i], block.timestamp);
        }
    }
}