// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SynapseToken
 * @dev ERC20 token for SynapseFi ecosystem with governance and staking capabilities
 * @notice This token serves as the native token for the SynapseFi platform
 */
contract SynapseToken is ERC20, ERC20Burnable, Ownable {
    
    /**
     * @dev Maximum supply of SYN tokens (100 million tokens)
     */
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    /**
     * @dev Event emitted when tokens are minted
     * @param to The address receiving the minted tokens
     * @param amount The amount of tokens minted
     */
    event TokensMinted(address indexed to, uint256 amount);
    
    /**
     * @dev Constructor that mints initial supply to the deployer
     * @param initialSupply The initial supply of tokens to mint
     * @notice The deployer becomes the contract owner
     */
    constructor(uint256 initialSupply) 
        ERC20("Synapse Token", "SYN") 
        Ownable(msg.sender)
    {
        require(initialSupply <= MAX_SUPPLY, "SynapseToken: Initial supply exceeds maximum");
        _mint(msg.sender, initialSupply);
        emit TokensMinted(msg.sender, initialSupply);
    }
    
    /**
     * @dev Mints new tokens (only callable by owner)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     * @notice Total supply cannot exceed MAX_SUPPLY
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "SynapseToken: Minting would exceed max supply");
        require(to != address(0), "SynapseToken: Cannot mint to zero address");
        require(amount > 0, "SynapseToken: Mint amount must be greater than zero");
        
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Batch mint tokens to multiple addresses (only callable by owner)
     * @param recipients Array of addresses to mint tokens to
     * @param amounts Array of amounts to mint for each recipient
     * @notice Arrays must have the same length and total cannot exceed MAX_SUPPLY
     */
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "SynapseToken: Arrays length mismatch");
        require(recipients.length > 0, "SynapseToken: Empty arrays");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(recipients[i] != address(0), "SynapseToken: Cannot mint to zero address");
            require(amounts[i] > 0, "SynapseToken: Mint amount must be greater than zero");
            totalAmount += amounts[i];
        }
        
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "SynapseToken: Minting would exceed max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
            emit TokensMinted(recipients[i], amounts[i]);
        }
    }
    
    /**
     * @dev Returns the number of decimals for the token
     * @return uint8 The number of decimals (18)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
    
    /**
     * @dev Gets the maximum supply of tokens
     * @return uint256 The maximum supply in wei
     */
    function maxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }
    
    /**
     * @dev Checks if an address has a balance greater than zero
     * @param account The address to check
     * @return bool True if the address has a balance greater than zero
     */
    function hasBalance(address account) external view returns (bool) {
        return balanceOf(account) > 0;
    }
}