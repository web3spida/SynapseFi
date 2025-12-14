// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RWARegistry is Ownable {
    enum Status {
        None,
        Pending,
        Active,
        Rejected
    }

    struct Asset {
        uint256 id;
        address issuer;
        Status status;
    }

    mapping(uint256 => Asset) private _assets;

    event AssetProposed(uint256 indexed id, address indexed issuer);
    event AssetApproved(uint256 indexed id, address indexed admin);
    event AssetRejected(uint256 indexed id, address indexed admin);

    constructor() Ownable(msg.sender) {}

    function proposeAsset(uint256 id) external {
        require(id != 0, "RWARegistry: invalid id");
        require(_assets[id].id == 0, "RWARegistry: asset exists");

        _assets[id] = Asset({id: id, issuer: msg.sender, status: Status.Pending});

        emit AssetProposed(id, msg.sender);
    }

    function approveAsset(uint256 id) external onlyOwner {
        Asset storage asset = _assets[id];
        require(asset.id != 0, "RWARegistry: unknown asset");
        require(asset.status == Status.Pending, "RWARegistry: not pending");

        asset.status = Status.Active;

        emit AssetApproved(id, msg.sender);
    }

    function rejectAsset(uint256 id) external onlyOwner {
        Asset storage asset = _assets[id];
        require(asset.id != 0, "RWARegistry: unknown asset");
        require(asset.status == Status.Pending, "RWARegistry: not pending");

        asset.status = Status.Rejected;

        emit AssetRejected(id, msg.sender);
    }

    function getAsset(uint256 id) external view returns (Asset memory) {
        return _assets[id];
    }

    function getStatus(uint256 id) external view returns (Status) {
        return _assets[id].status;
    }
}

