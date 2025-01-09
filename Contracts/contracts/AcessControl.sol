// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UniversityRegistration.sol"; // Importing the University Registration contract

contract AccessControlVerification {
    struct Document {
        address uploader;
        bytes32 documentHash;
        bool isVerified;
        uint256 uploadDate;
    }

    struct AccessLog {
        address accessor;
        uint256 accessDate;
    }

    // State Variables
    mapping(bytes32 => Document) public documents;
    mapping(bytes32 => AccessLog[]) public accessLogs;
    mapping(bytes32 => mapping(address => uint256)) public accessExpiry; // Expiry for each accessor

    UniversityRegistration public universityRegistration;

    // Role Management
    enum Role { Student, University, Admin }
    mapping(address => Role) public roles;

    // Events
    event DocumentVerified(bytes32 indexed documentHash);
    event DocumentAccessGranted(bytes32 indexed documentHash, address indexed accessor, uint256 expiry);
    event DocumentAccessRevoked(bytes32 indexed documentHash, address indexed accessor);
    event DocumentAccessed(bytes32 indexed documentHash, address indexed accessor, uint256 accessDate);

    // Constructor to set the University Registration contract address
    constructor(address _universityRegistrationAddress) {
        universityRegistration = UniversityRegistration(_universityRegistrationAddress);
    }

    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Access denied: insufficient permissions");
        _;
    }

    function assignRole(address _user, Role _role) public onlyRole(Role.Admin) {
        require(_user != address(0), "Invalid address: cannot assign role to zero address");
        roles[_user] = _role;
    }

    function revokeRole(address _user) public onlyRole(Role.Admin) {
        delete roles[_user];
    }

    // Function to upload a document
    function uploadDocument(bytes32 _documentHash) public onlyRole(Role.Student) {
        require(documents[_documentHash].uploader == address(0), "Document already exists");

        documents[_documentHash] = Document({
            uploader: msg.sender,
            documentHash: _documentHash,
            isVerified: false,
            uploadDate: block.timestamp
        });
    }

    // Verify Document
    function verifyDocument(bytes32 _documentHash) public {
        require(documents[_documentHash].uploader == msg.sender, "Only the uploader can verify the document");
        require(!documents[_documentHash].isVerified, "Document already verified");

        documents[_documentHash].isVerified = true;

        emit DocumentVerified(_documentHash);
    }

    // Grant Temporary Access
    function grantAccess(bytes32 _documentHash, address _accessor, uint256 _duration) public {
        require(documents[_documentHash].uploader == msg.sender, "Only the uploader can grant access");
        require(documents[_documentHash].isVerified, "Document must be verified to grant access");

        accessExpiry[_documentHash][_accessor] = block.timestamp + _duration;
        emit DocumentAccessGranted(_documentHash, _accessor, accessExpiry[_documentHash][_accessor]);
    }

    // Revoke Access
    function revokeAccess(bytes32 _documentHash, address _accessor) public {
        require(documents[_documentHash].uploader == msg.sender, "Only the uploader can revoke access");
        require(accessExpiry[_documentHash][_accessor] > block.timestamp, "Access already expired");

        accessExpiry[_documentHash][_accessor] = 0; // Set access to 0 to indicate revocation
        emit DocumentAccessRevoked(_documentHash, _accessor);
    }

    // Access Document
    function accessDocument(bytes32 _documentHash) public returns (bool) {
        require(documents[_documentHash].isVerified, "Document is not verified");
        require(accessExpiry[_documentHash][msg.sender] > block.timestamp, "Access expired");

        accessLogs[_documentHash].push(AccessLog({
            accessor: msg.sender,
            accessDate: block.timestamp
        }));

        emit DocumentAccessed(_documentHash, msg.sender, block.timestamp);
        return true;
    }

    // Check Verification Status
    function checkVerificationStatus(bytes32 _documentHash) public view returns (bool) {
        return documents[_documentHash].isVerified;
    }
}
