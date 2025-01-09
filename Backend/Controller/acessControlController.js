const { ethers } = require("ethers");
const AccessControlVerification = require("../../Contracts/artifacts/contracts/AcessControl.sol/AccessControlVerification.json"); // Adjust path as necessary
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // Adjust provider as necessary
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with actual contract address
const accessControlContract = new ethers.Contract(contractAddress, AccessControlVerification.abi, provider);

exports.uploadDocument = async (req, res) => {
    const { documentHash } = req.body;
    
    // Use a wallet for signing (replace with actual private key or wallet)
    const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider); // Replace with actual private key or wallet
    const contractWithSigner = accessControlContract.connect(signer);

    try {
        const tx = await contractWithSigner.uploadDocument(documentHash);
        await tx.wait();
        res.status(200).json({ message: "Document uploaded successfully." });
    } catch (error) {
        // Handle specific error cases
        if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
            return res.status(400).json({ error: "Transaction failed due to gas issues." });
        }
        res.status(500).json({ error: error.message });
    }
};

// Add additional methods for verification and access management here
