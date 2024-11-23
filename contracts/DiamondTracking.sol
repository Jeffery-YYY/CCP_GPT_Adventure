// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DiamondTracking is ERC721, Ownable {
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

    event CertificateCreated(uint256 indexed tokenId, address indexed owner);
    event EventLogged(uint256 indexed tokenId, string description);
    event OwnershipTransferred(
        uint256 indexed tokenId,
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() ERC721("JewelryCertificate", "JWL") {}

    function _baseURI() internal pure override returns (string memory) {
        // 设置链下元数据基础路径，例如 IPFS 或 HTTPS 服务器
        return "https://example.com/metadata/";
    }

    // 仅限合约所有者授权制造商
    function authorizeManufacturer(address manufacturer) external onlyOwner {
        require(!authorizedManufacturers[manufacturer], "Manufacturer already authorized");
        authorizedManufacturers[manufacturer] = true;
    }

    // 仅限合约所有者撤销制造商授权
    function revokeManufacturer(address manufacturer) external onlyOwner {
        require(authorizedManufacturers[manufacturer], "Manufacturer not authorized");
        authorizedManufacturers[manufacturer] = false;
    }

    // 创建新的 NFT 证书
    function createCertificate(uint256 tokenId, address owner) external {
        require(authorizedManufacturers[msg.sender], "Caller is not an authorized manufacturer");
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

    // 添加事件记录到指定证书
    function logEvent(uint256 tokenId, string memory description) external {
        require(_exists(tokenId), "Token ID does not exist");
        require(authorizedManufacturers[msg.sender], "Caller is not an authorized manufacturer");

        events[tokenId].push(Event(description, block.timestamp));
        emit EventLogged(tokenId, description);
    }

    // 转移证书所有权
    function transferCertificateOwnership(uint256 tokenId, address newOwner) external {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner of the token");

        _transfer(msg.sender, newOwner, tokenId);

        diamonds[tokenId].currentOwner = newOwner;
        events[tokenId].push(Event("Ownership transferred", block.timestamp));
        emit OwnershipTransferred(tokenId, msg.sender, newOwner);
    }

    // 获取指定证书的事件记录
    function getEvents(uint256 tokenId) external view returns (Event[] memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return events[tokenId];
    }
}
