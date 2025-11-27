// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreditPassport
 * @dev ERC721 Passport NFT with on-chain credit score registry
 * @notice Users mint a single Passport; owner updates scores; metadata URI is set on mint and can be updated by owner
 */
contract CreditPassport is ERC721URIStorage, Ownable {
    /**
     * @dev Struct to store user credit score information
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
     * @dev Mapping of owner to passport tokenId (one per address)
     */
    mapping(address => uint256) private _passportOf;

    /**
     * @dev Next tokenId to mint
     */
    uint256 private _nextTokenId = 1;

    /**
     * @dev Event emitted when a user's credit score is updated
     */
    event ScoreUpdated(address indexed user, uint256 score, uint256 timestamp);

    /**
     * @dev Event emitted when a passport is minted
     */
    event PassportMinted(address indexed owner, uint256 indexed tokenId, string uri);

    constructor() ERC721("SynapseFi Passport", "SPASS") Ownable(msg.sender) {}

    /**
     * @dev Mint a passport NFT for msg.sender
     * @param uri Initial metadata URI
     * @return tokenId Newly minted token id
     */
    function mintPassport(string memory uri) external returns (uint256 tokenId) {
        require(_passportOf[msg.sender] == 0, "CreditPassport: Passport already minted");

        tokenId = _nextTokenId++;
        _passportOf[msg.sender] = tokenId;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        emit PassportMinted(msg.sender, tokenId, uri);
    }

    /**
     * @dev Update metadata URI for a passport (owner controlled)
     * @param tokenId Passport token id
     * @param uri New metadata URI
     */
    function updatePassportURI(uint256 tokenId, string memory uri) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "CreditPassport: Invalid tokenId");
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Updates the credit score for a specific user (only callable by owner)
     * @param user The address of the user to update
     * @param score The new credit score (0-1000)
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
     */
    function getScore(address user) external view returns (uint256 score, uint256 lastUpdated) {
        UserScore memory userScore = _userScores[user];
        return (userScore.score, userScore.lastUpdated);
    }

    /**
     * @dev Checks if a user has an existing passport
     */
    function hasPassport(address user) external view returns (bool) {
        return _passportOf[user] != 0;
    }

    /**
     * @dev Get passport tokenId for a user (0 if none)
     */
    function passportOf(address user) external view returns (uint256) {
        return _passportOf[user];
    }

    /**
     * @dev Gets the complete UserScore struct for a user
     */
    function getUserScore(address user) external view returns (UserScore memory) {
        return _userScores[user];
    }

    /**
     * @dev Batch update scores for multiple users (only callable by owner)
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
