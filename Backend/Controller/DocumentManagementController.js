const { ethers } = require("ethers");
const DocumentManagement = require("../../Contracts/artifacts/contracts/DocumentManagement.sol/DocumentManagement.json");
const { uploadToIPFS } = require("../Services/ipfsService");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"; // Replace with actual address
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const documentManagementContract = new ethers.Contract(contractAddress, DocumentManagement.abi, wallet);

exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        console.log("File received:", req.file);

        // Upload the document to IPFS
        const ipfsResponse = await uploadToIPFS(req.file);
        console.log("IPFS upload successful:", ipfsResponse);

        // Ensure ipfsResponse is the CID
        const documentHash = ipfsResponse.cid;  // Assuming ipfsResponse contains a `cid`
        const metadata = req.body.metadata || "";  // Use optional metadata if provided

        // Upload document to the contract
        const tx = await documentManagementContract.uploadDocument(documentHash, metadata);
        
        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction mined:", receipt);

        res.status(200).json({
            message: "File uploaded successfully",
            data: { cid: documentHash, transactionHash: receipt.transactionHash },
        });
    } catch (error) {
        console.error("Error uploading document:", error.stack);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
