// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JewelryCertificate is ERC721, Ownable {
    struct Event {
        string description;
        uint256 timestamp;
    }

    struct Diamond {
        uint256 id;
        string status;
        address currentOwner;
    }

    mapping(uint256 => Event[]) public events;
    mapping(uint256 => Diamond) public diamonds;
    mapping(address => bool) public authorizedManufacturers;

    event CertificateCreated(uint256 tokenId, address owner);
    event EventLogged(uint256 tokenId, string description);
    event OwnershipTransferred(uint256 tokenId, address from, address to);

    constructor() ERC721("JewelryCertificate", "JWL") {}

    function authorizeManufacturer(address manufacturer) external onlyOwner {
        authorizedManufacturers[manufacturer] = true;
    }

    function revokeManufacturer(address manufacturer) external onlyOwner {
        authorizedManufacturers[manufacturer] = false;
    }

    function createCertificate(uint256 tokenId, address owner) external {
        require(authorizedManufacturers[msg.sender], "Not authorized");
        _mint(owner, tokenId);

        // 初始化 diamonds 数据
        diamonds[tokenId] = Diamond({
            id: tokenId,
            status: "Certificate created",
            currentOwner: owner
        });

        events[tokenId].push(Event("Certificate created", block.timestamp));
        emit CertificateCreated(tokenId, owner);
    }

    function logEvent(uint256 tokenId, string memory description) external {
        require(_exists(tokenId), "Token does not exist");
        require(authorizedManufacturers[msg.sender], "Not authorized");
        events[tokenId].push(Event(description, block.timestamp));
        emit EventLogged(tokenId, description);
    }

    function transferCertificateOwnership(uint256 tokenId, address newOwner) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner!");
        _transfer(msg.sender, newOwner, tokenId);

        // 更新 diamonds 的 currentOwner
        diamonds[tokenId].currentOwner = newOwner;

        // 记录事件
        events[tokenId].push(Event("Ownership transferred", block.timestamp));
        emit OwnershipTransferred(tokenId, msg.sender, newOwner);
    }


    function getEvents(uint256 tokenId) external view returns (Event[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return events[tokenId];
    }
}
