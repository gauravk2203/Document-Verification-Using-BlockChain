// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for Document Management System
interface IDocumentManagementSystem {
    function uploadDocument(address _universityAddress, string memory _documentHash) external;
}

contract UniversityRegistration {
    struct University {
        string name;
        string location;
        uint collegeCode;
        bool isVerified;
    }

    mapping(address => University) public universities;
    mapping(uint => bool) public registeredCollegeCodes;
    address public admin;
    address[] public universityAddresses;

    // Events
    event UniversityRegistered(address indexed universityAddress, string name, string location, uint collegeCode);
    event UniversityVerified(address indexed universityAddress);
    event UniversityRevoked(address indexed universityAddress);
    event DocumentManagementSystemUpdated(address indexed newAddress);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);

    // Custom errors
    error OnlyAdmin();
    error UniversityAlreadyRegistered();
    error UniversityNotRegistered();
    error UniversityAlreadyVerified();
    error UniversityAlreadyRevoked();

    modifier onlyAdmin() {
        if (msg.sender != admin) {
            revert OnlyAdmin();
        }
        _;
    }

    IDocumentManagementSystem public documentManagementSystem;

    constructor(address _documentManagementSystemAddress) {
        admin = msg.sender;
        documentManagementSystem = IDocumentManagementSystem(_documentManagementSystemAddress);
    }

    // Set Document Management System
    function setDocumentManagementSystem(address _documentManagementSystemAddress) external onlyAdmin {
        documentManagementSystem = IDocumentManagementSystem(_documentManagementSystemAddress);
        emit DocumentManagementSystemUpdated(_documentManagementSystemAddress);
    }

    // Register a new university
    function registerUniversity(string memory _name, string memory _location, uint _collegeCode) external {
        if (bytes(universities[msg.sender].name).length != 0) {
            revert UniversityAlreadyRegistered();
        }

        if (registeredCollegeCodes[_collegeCode]) {
            revert UniversityAlreadyRegistered();
        }

        universities[msg.sender] = University(_name, _location, _collegeCode, false);
        registeredCollegeCodes[_collegeCode] = true;
        universityAddresses.push(msg.sender);

        emit UniversityRegistered(msg.sender, _name, _location, _collegeCode);
    }

    // Verify a university
    function verifyUniversity(address _universityAddress) external onlyAdmin {
        if (!_isUniversityRegistered(_universityAddress)) {
            revert UniversityNotRegistered();
        }

        if (universities[_universityAddress].isVerified) {
            revert UniversityAlreadyVerified();
        }

        universities[_universityAddress].isVerified = true;
        emit UniversityVerified(_universityAddress);
    }

    // Revoke university verification
    function revokeUniversity(address _universityAddress) external onlyAdmin {
        if (!_isUniversityRegistered(_universityAddress)) {
            revert UniversityNotRegistered();
        }

        if (!universities[_universityAddress].isVerified) {
            revert UniversityAlreadyRevoked();
        }

        universities[_universityAddress].isVerified = false;
        emit UniversityRevoked(_universityAddress);
    }

    // Upload a document (only by verified universities)
    function uploadDocument(string memory _documentHash) external {
        if (!universities[msg.sender].isVerified) {
            revert UniversityNotRegistered();
        }

        documentManagementSystem.uploadDocument(msg.sender, _documentHash);
    }

    // Change admin
    function changeAdmin(address newAdmin) external onlyAdmin {
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }

    // Get university details
    function getUniversity(address _universityAddress)
        external
        view
        returns (string memory, string memory, uint, bool)
    {
        if (!_isUniversityRegistered(_universityAddress)) {
            revert UniversityNotRegistered();
        }

        University memory university = universities[_universityAddress];
        return (university.name, university.location, university.collegeCode, university.isVerified);
    }

    // Get all universities
    function getAllUniversities() external view returns (address[] memory) {
        return universityAddresses;
    }

    // Get all university details (Admin only)
    function getAllUniversityDetails() external view onlyAdmin returns (University[] memory) {
        University[] memory allUniversities = new University[](universityAddresses.length);
        for (uint i = 0; i < universityAddresses.length; i++) {
            allUniversities[i] = universities[universityAddresses[i]];
        }
        return allUniversities;
    }

    // Internal helper to check registration
    function _isUniversityRegistered(address _universityAddress) internal view returns (bool) {
        return bytes(universities[_universityAddress].name).length != 0;
    }
}
