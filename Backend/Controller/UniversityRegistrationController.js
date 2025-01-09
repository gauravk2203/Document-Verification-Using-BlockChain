const { ethers } = require("ethers");
const UniversityRegistration = require("../artifacts/UniversityRegistration.json"); // Adjust path as necessary

// Adjust the provider (RPC URL) and contract address as needed
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); 
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with actual contract address

// Get the contract with the provider
const universityRegistrationContract = new ethers.Contract(contractAddress, UniversityRegistration.abi, provider);

exports.registerUniversity = async (req, res) => {
    const { name, location, collegeCode } = req.body;

    // Validate inputs
    if (!name || !location || !collegeCode) {
        return res.status(400).json({ error: "All fields (name, location, collegeCode) are required." });
    }

    try {
        // Get signer from the environment (use your private key)
        const signer = provider.getSigner(); 

        // Connect the contract with the signer
        const contractWithSigner = universityRegistrationContract.connect(signer);

        // Send the transaction
        const tx = await contractWithSigner.registerUniversity(name, location, collegeCode);
        console.log("Transaction sent:", tx.hash);  // Log the transaction hash

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction mined:", receipt);

        // Return success response with transaction hash
        res.status(200).json({ 
            message: "University registered successfully.",
            transactionHash: tx.hash 
        });
    } catch (error) {
        console.error("Error registering university:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Additional methods for verification and details retrieval can be added here
