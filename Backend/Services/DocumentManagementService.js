const { ethers } = require("ethers");
const DocumentManagement = require("../../Contracts/artifacts/contracts/DocumentManagement.sol/DocumentManagement.json");
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // Adjust provider as necessary
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with actual contract address
const documentManagementContract = new ethers.Contract(contractAddress, DocumentManagement.abi, provider);

exports.uploadDocument = async (documentHash, ipfsLink, metadata) => {
  try {
    const signer = provider.getSigner();
    const contractWithSigner = documentManagementContract.connect(signer);
    
    // Estimate gas for the transaction
    const gasEstimate = await contractWithSigner.estimateGas.uploadDocument(documentHash, ipfsLink, metadata);
    
    // Send the transaction with estimated gas
    const tx = await contractWithSigner.uploadDocument(documentHash, ipfsLink, metadata, {
      gasLimit: gasEstimate
    });
    
    // Wait for the transaction to be mined
    await tx.wait();
    
    return "Document uploaded successfully.";
  } catch (error) {
    console.error("Error uploading document:", error);
    throw new Error(`Transaction failed: ${error.message}`);
  }
};

// Additional methods for document retrieval and updates can be added here
