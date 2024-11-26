// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract JewelryCertificate is ERC721, AccessControl, Pausable {
    struct Event {
        string description;
        uint256 timestamp;
    }

    struct Diamond {
        uint256 id;
        string status;
        address currentOwner;
    }

    bytes32 public constant MINER_ROLE = keccak256("MINER_ROLE");
    bytes32 public constant CUTTER_ROLE = keccak256("CUTTER_ROLE");
    bytes32 public constant GRADER_ROLE = keccak256("GRADER_ROLE");
    bytes32 public constant JEWELER_ROLE = keccak256("JEWELER_ROLE");
    bytes32 public constant CUSTOMER_ROLE = keccak256("CUSTOMER_ROLE");

    mapping(uint256 => Event[]) public events;
    mapping(uint256 => Diamond) public diamonds;

    event CertificateCreated(uint256 indexed tokenId, address indexed owner);
    event EventLogged(uint256 indexed tokenId, string description, string status);
    event OwnershipTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event CertificateBurned(uint256 indexed tokenId);

    constructor() ERC721("JewelryCertificate", "JWL") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender); // 合约部署者为默认管理员
    }

    // Pausing and unpausing the contract
    function pauseContract() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpauseContract() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // Override hasRole to allow DEFAULT_ADMIN_ROLE to have all permissions
    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
        if (super.hasRole(DEFAULT_ADMIN_ROLE, account)) {
            return true; // 默认管理员拥有所有角色权限
        }
        return super.hasRole(role, account);
    }

    // Create certificate, only miners can initiate the lifecycle
    function createCertificate(uint256 tokenId, address owner) external whenNotPaused {
        require(hasRole(MINER_ROLE, msg.sender), "Caller is not a miner");
        require(!_exists(tokenId), "Token ID already exists");

        _mint(owner, tokenId);

        diamonds[tokenId] = Diamond({
            id: tokenId,
            status: "mined",
            currentOwner: owner
        });

        events[tokenId].push(Event("Certificate created: mined", block.timestamp));
        emit CertificateCreated(tokenId, owner);
    }

    // Log lifecycle events with role-based control
    function logEvent(uint256 tokenId, string memory description, string memory newStatus) external whenNotPaused {
        require(_exists(tokenId), "Token does not exist");

        string memory currentStatus = diamonds[tokenId].status;

        if (keccak256(bytes(newStatus)) == keccak256(bytes("cut"))) {
            require(
                hasRole(CUTTER_ROLE, msg.sender) && keccak256(bytes(currentStatus)) == keccak256(bytes("mined")),
                "Caller not authorized or invalid current status"
            );
        } else if (keccak256(bytes(newStatus)) == keccak256(bytes("graded"))) {
            require(
                hasRole(GRADER_ROLE, msg.sender) && keccak256(bytes(currentStatus)) == keccak256(bytes("cut")),
                "Caller not authorized or invalid current status"
            );
        } else if (keccak256(bytes(newStatus)) == keccak256(bytes("jewelry made"))) {
            require(
                hasRole(JEWELER_ROLE, msg.sender) && keccak256(bytes(currentStatus)) == keccak256(bytes("graded")),
                "Caller not authorized or invalid current status"
            );
        } else {
            revert("Invalid new status");
        }

        // Update status
        diamonds[tokenId].status = newStatus;

        // Log event
        events[tokenId].push(Event(description, block.timestamp));
        emit EventLogged(tokenId, description, newStatus);
    }

    // Transfer ownership of the certificate
    function transferCertificateOwnership(uint256 tokenId, address newOwner) external whenNotPaused {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner");
        require(hasRole(CUSTOMER_ROLE, newOwner), "New owner is not a customer");

        _transfer(msg.sender, newOwner, tokenId);

        diamonds[tokenId].currentOwner = newOwner;

        events[tokenId].push(Event("Ownership transferred", block.timestamp));
        emit OwnershipTransferred(tokenId, msg.sender, newOwner);
    }

    // Burn a certificate (only admin can perform this action)
    function burnCertificate(uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        require(_exists(tokenId), "Token does not exist");

        _burn(tokenId);
        delete diamonds[tokenId];
        delete events[tokenId];

        emit CertificateBurned(tokenId); // 添加销毁事件
    }

    // Retrieve all events for a given token ID
    function getEvents(uint256 tokenId) external view returns (Event[] memory) {
        require(
            _exists(tokenId) &&
            (msg.sender == ownerOf(tokenId) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender)),
            "Not authorized to view events"
        );
        return events[tokenId];
    }

    // Get certificate details
    function getCertificateDetails(uint256 tokenId) external view returns (Diamond memory, Event[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return (diamonds[tokenId], events[tokenId]);
    }

    // Override supportsInterface to resolve conflict between ERC721 and AccessControl
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}