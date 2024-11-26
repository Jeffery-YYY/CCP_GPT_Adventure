// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract JewelryCertificate is ERC721, AccessControl, Pausable {
    enum Status { None, Mined, Cut, Graded, JewelryMade }

    struct Event {
        string description;
        Status status;
        uint256 timestamp;
    }

    struct Diamond {
        uint256 id;
        Status status;
        address currentOwner;
    }

    bytes32 public constant MINER_ROLE = keccak256("MINER_ROLE");
    bytes32 public constant CUTTER_ROLE = keccak256("CUTTER_ROLE");
    bytes32 public constant GRADER_ROLE = keccak256("GRADER_ROLE");
    bytes32 public constant JEWELER_ROLE = keccak256("JEWELER_ROLE");
    bytes32 public constant CUSTOMER_ROLE = keccak256("CUSTOMER_ROLE");

    address public superAdmin; // 固定管理员地址

    mapping(uint256 => Event[]) public events;
    mapping(uint256 => Diamond) public diamonds;

    event CertificateCreated(uint256 indexed tokenId, address indexed owner);
    event EventLogged(uint256 indexed tokenId, string description, Status status);
    event OwnershipTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event CertificateBurned(uint256 indexed tokenId);

    constructor(address _superAdmin) ERC721("JewelryCertificate", "JWL") {
        superAdmin = _superAdmin;
        _setupRole(DEFAULT_ADMIN_ROLE, _superAdmin);
    }

    // 覆写 hasRole 方法，使 superAdmin 拥有所有权限
    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
        if (account == superAdmin) {
            return true; // superAdmin 拥有所有角色
        }
        return super.hasRole(role, account);
    }

    function createCertificate(uint256 tokenId, address owner) external whenNotPaused {
        require(hasRole(MINER_ROLE, msg.sender), "Caller is not a miner");
        require(!_exists(tokenId), "Token ID already exists");

        _mint(owner, tokenId);

        diamonds[tokenId] = Diamond({
            id: tokenId,
            status: Status.Mined,
            currentOwner: owner
        });

        events[tokenId].push(Event("Certificate created: mined", Status.Mined, block.timestamp));
        emit CertificateCreated(tokenId, owner);
    }

    function logEvent(uint256 tokenId, string memory description, Status newStatus) external whenNotPaused {
        require(_exists(tokenId), "Token does not exist");

        Status currentStatus = diamonds[tokenId].status;

        if (newStatus == Status.Cut) {
            require(
                hasRole(CUTTER_ROLE, msg.sender) && currentStatus == Status.Mined,
                "Caller not authorized or invalid current status"
            );
        } else if (newStatus == Status.Graded) {
            require(
                hasRole(GRADER_ROLE, msg.sender) && currentStatus == Status.Cut,
                "Caller not authorized or invalid current status"
            );
        } else if (newStatus == Status.JewelryMade) {
            require(
                hasRole(JEWELER_ROLE, msg.sender) && currentStatus == Status.Graded,
                "Caller not authorized or invalid current status"
            );
        } else {
            revert("Invalid new status");
        }

        diamonds[tokenId].status = newStatus;

        events[tokenId].push(Event(description, newStatus, block.timestamp));
        emit EventLogged(tokenId, description, newStatus);
    }

    function transferCertificateOwnership(uint256 tokenId, address newOwner) external whenNotPaused {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner");
        require(hasRole(CUSTOMER_ROLE, newOwner), "New owner is not a customer");

        _transfer(msg.sender, newOwner, tokenId);

        diamonds[tokenId].currentOwner = newOwner;

        events[tokenId].push(Event("Ownership transferred", Status.None, block.timestamp));
        emit OwnershipTransferred(tokenId, msg.sender, newOwner);
    }

    // 新增方法：获取 Token 的当前状态
    function getCurrentStatus(uint256 tokenId) external view returns (Status) {
        require(_exists(tokenId), "Token does not exist");
        return diamonds[tokenId].status;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function getEvents(uint256 tokenId) external view returns (Event[] memory) {
    require(_exists(tokenId), "Token does not exist");
    return events[tokenId];
}
}