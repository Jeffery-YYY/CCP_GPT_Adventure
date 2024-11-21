// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract JewelryCertificate is ERC721 {
    struct Event {
        string description;
        uint256 timestamp;
    }

    mapping(uint256 => Event[]) public events;

    constructor() ERC721("JewelryCertificate", "JWL") {}

    function createCertificate(uint256 tokenId, address owner) external {
        _mint(owner, tokenId);
    }

    function logEvent(uint256 tokenId, string memory description) external {
        require(_exists(tokenId), "Token does not exist");
        events[tokenId].push(Event(description, block.timestamp));
    }
}
