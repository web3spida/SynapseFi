// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RWAOracle is Ownable {
    mapping(uint256 => uint256) private _prices;

    event PriceUpdated(uint256 indexed assetId, uint256 price, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function setPrice(uint256 assetId, uint256 price) external onlyOwner {
        require(assetId != 0, "RWAOracle: invalid assetId");

        _prices[assetId] = price;

        emit PriceUpdated(assetId, price, block.timestamp);
    }

    function getPrice(uint256 assetId) external view returns (uint256) {
        return _prices[assetId];
    }
}

