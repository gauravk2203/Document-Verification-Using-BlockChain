// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UniversityRegistration.sol"; // Import the University Registration contract

contract DocumentManagement {
    struct Document {
        string ipfsLink;
        string metadata; // Optional metadata
        address uploader; // Address of the university that uploaded the document
        uint256 uploadDate; // Timestamp of upload
        bool deleted; // Flag for soft delete
    }

    // State Variables
    mapping(bytes32 => Document) private documents; // Mapping from document hash to Document struct

    // Events
    event DocumentUploaded(bytes32 indexed documentHash, address indexed universityAddress);
    event DocumentMetadataUpdated(bytes32 indexed documentHash, string newMetadata);
    event DocumentDeleted(bytes32 indexed documentHash);

    // Reference to the University Registration contract
    UniversityRegistration private universityRegistration;

    // Constructor to set the University Registration contract address
    constructor(address _universityRegistrationAddress) {
        universityRegistration = UniversityRegistration(_universityRegistrationAddress);
    }

    // Modifier to ensure only verified universities can upload documents
    modifier onlyVerifiedUniversity() {
        (string memory name, string memory location, uint256 registrationDate, bool isVerified) = universityRegistration.getUniversity(msg.sender);
        require(isVerified, "Only verified universities can upload documents");
        _;
    }

    // Modifier to check if a document exists and is not deleted
    modifier documentExists(bytes32 _documentHash) {
        require(bytes(documents[_documentHash].ipfsLink).length != 0, "Document does not exist");
        require(!documents[_documentHash].deleted, "Document has been deleted");
        _;
    }

    // Function to upload a single document with metadata
    function uploadDocument(bytes32 _documentHash, string memory _ipfsLink, string memory _metadata) public onlyVerifiedUniversity {
        require(bytes(documents[_documentHash].ipfsLink).length == 0, "Document already exists");

        documents[_documentHash] = Document({
            ipfsLink: _ipfsLink,
            metadata: _metadata, // Initialize with provided metadata
            uploader: msg.sender,
            uploadDate: block.timestamp,
            deleted: false // Document is not deleted
        });

        emit DocumentUploaded(_documentHash, msg.sender);
    }

    // Function to upload multiple documents in one call with metadata
    function uploadMultipleDocuments(bytes32[] memory _documentHashes, string[] memory _ipfsLinks, string[] memory _metadatas) public onlyVerifiedUniversity {
        require(_documentHashes.length == _ipfsLinks.length && _documentHashes.length == _metadatas.length, "Arrays must have the same length");

        for (uint i = 0; i < _documentHashes.length; i++) {
            require(bytes(documents[_documentHashes[i]].ipfsLink).length == 0, "Document already exists");

            documents[_documentHashes[i]] = Document({
                ipfsLink: _ipfsLinks[i],
                metadata: _metadatas[i], // Initialize with provided metadata
                uploader: msg.sender,
                uploadDate: block.timestamp,
                deleted: false // Document is not deleted
            });

            emit DocumentUploaded(_documentHashes[i], msg.sender);
        }
    }

    // Function to retrieve document details
    function getDocumentDetails(bytes32 _documentHash) external view documentExists(_documentHash) returns (string memory, string memory, address, uint256) {
        Document memory doc = documents[_documentHash];
        return (doc.ipfsLink, doc.metadata, doc.uploader, doc.uploadDate);
    }

    // Function to update document metadata
    function updateDocumentMetadata(bytes32 _documentHash, string memory _newMetadata) public onlyVerifiedUniversity documentExists(_documentHash) {
        require(documents[_documentHash].uploader == msg.sender, "Only the uploader can update the metadata");

        documents[_documentHash].metadata = _newMetadata;

        emit DocumentMetadataUpdated(_documentHash, _newMetadata);
    }

    // Function to delete a document (soft delete)
    function deleteDocument(bytes32 _documentHash) public onlyVerifiedUniversity documentExists(_documentHash) {
        require(documents[_documentHash].uploader == msg.sender, "Only the uploader can delete the document");

        documents[_documentHash].deleted = true; // Soft delete the document

        emit DocumentDeleted(_documentHash);
    }
}
