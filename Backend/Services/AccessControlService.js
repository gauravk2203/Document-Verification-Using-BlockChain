const { ethers } = require("ethers");
const AccessControlVerification = require("../../Contracts/artifacts/contracts/AcessControl.sol/AccessControlVerification.json");
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // Adjust provider as necessary
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with actual contract address
const accessControlContract = new ethers.Contract(contractAddress, AccessControlVerification.abi, provider);

exports.uploadDocument = async (documentHash) => {
  try {
    const signer = provider.getSigner();
    const contractWithSigner = accessControlContract.connect(signer);
    
    // Estimate gas for the transaction
    const gasEstimate = await contractWithSigner.estimateGas.uploadDocument(documentHash);
    
    // Send the transaction with estimated gas
    const tx = await contractWithSigner.uploadDocument(documentHash, {
      gasLimit: gasEstimate
    });
    
    await tx.wait();
    return "Document uploaded successfully.";
  } catch (error) {
    console.error("Error uploading document:", error);
    throw new Error(`Transaction failed: ${error.message}`);
  }
};
