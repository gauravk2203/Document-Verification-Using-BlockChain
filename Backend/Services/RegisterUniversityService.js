const { ethers } = require("ethers");
const UniversityRegistration = require("../../Contracts/artifacts/contracts/UniversityRegistration.sol/UniversityRegistration.json"); // Adjust path as necessary
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // Adjust provider as necessary
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with actual contract address
const universityRegistrationContract = new ethers.Contract(contractAddress, UniversityRegistration.abi, provider);

exports.registerUniversity = async (name, location, collegeCode) => {
  try {
    const signer = provider.getSigner(); // Get the signer
    const contractWithSigner = universityRegistrationContract.connect(signer); // Connect contract with signer

    // Estimate gas for the transaction
    const gasEstimate = await contractWithSigner.estimateGas.registerUniversity(name, location, collegeCode);

    // Send transaction with estimated gas
    const tx = await contractWithSigner.registerUniversity(name, location, collegeCode, {
      gasLimit: gasEstimate
    });

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log("Transaction successful:", receipt);
    return "University registered successfully.";
  } catch (error) {
    console.error("Error registering university:", error.message);
    throw new Error(`Transaction failed: ${error.message}`);
  }
};

// Additional methods for verification and details retrieval can be added here
