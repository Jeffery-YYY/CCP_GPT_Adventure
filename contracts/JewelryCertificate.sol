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
    mapping(address => bool) public authorizedUsers;

    event CertificateCreated(uint256 indexed tokenId, address indexed owner);
    event EventLogged(uint256 indexed tokenId, string description);
    event OwnershipTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event UserAuthorized(address indexed user);
    event UserRevoked(address indexed user);

    constructor() ERC721("JewelryCertificate", "JWL") {}

    function authorizeManufacturer(address manufacturer) external onlyOwner {
        require(manufacturer != address(0), "Cannot authorize zero address");
        authorizedManufacturers[manufacturer] = true;
    }

    function revokeManufacturer(address manufacturer) external onlyOwner {
        require(manufacturer != address(0), "Cannot revoke zero address");
        authorizedManufacturers[manufacturer] = false;
    }

    function authorizeUser(address user) external onlyOwner {
        require(user != address(0), "Cannot authorize zero address");
        authorizedUsers[user] = true;
        emit UserAuthorized(user);
    }

    function revokeUser(address user) external onlyOwner {
        require(user != address(0), "Cannot revoke zero address");
        authorizedUsers[user] = false;
        emit UserRevoked(user);
    }

    function isAuthorized(address user) public view returns (bool) {
        return authorizedUsers[user];
    }

    function createCertificate(uint256 tokenId, address owner) external {
        require(
            authorizedManufacturers[msg.sender] || isAuthorized(msg.sender),
            "Caller is not authorized"
        );
        require(!_exists(tokenId), "Token ID already exists");

        _mint(owner, tokenId);

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
        require(
            ownerOf(tokenId) == msg.sender || authorizedManufacturers[msg.sender],
            "Caller is not authorized"
        );
        require(bytes(description).length <= 256, "Description too long");

        events[tokenId].push(Event(description, block.timestamp));
        emit EventLogged(tokenId, description);
    }


    function transferCertificateOwnership(uint256 tokenId, address newOwner) external {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner");

        _transfer(msg.sender, newOwner, tokenId);

        diamonds[tokenId].currentOwner = newOwner;

        events[tokenId].push(Event("Ownership transferred", block.timestamp));
        emit OwnershipTransferred(tokenId, msg.sender, newOwner);
    }

    function getEvents(uint256 tokenId) external view returns (Event[] memory) {
        require(
            msg.sender == ownerOf(tokenId) || 
            getApproved(tokenId) == msg.sender || 
            isApprovedForAll(ownerOf(tokenId), msg.sender) || 
            isAuthorized(msg.sender),
            "Not authorized to view events"
        );
        return events[tokenId];
    }
}
