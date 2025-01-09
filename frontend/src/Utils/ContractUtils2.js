import { ethers , keccak256, toUtf8Bytes} from "ethers";
import { documentManagementAddress, documentManagementABI } from "../ABIfolder/Contractconfig"; // Replace with correct import for your contract
import { getProviderAndSigner } from "./etherSetup"; // Assuming you already have this setup for signing

// Function to get contract instance
const getDocumentManagementContractInstance = async () => {
    const { signer } = await getProviderAndSigner();
    return new ethers.Contract(documentManagementAddress, documentManagementABI, signer);
};

// Function to upload the document hash to the blockchain after IPFS upload
export const uploadDocumentToBlockchain = async (ipfsHash) => {
    try {
        const documentManagementContract = await getDocumentManagementContractInstance();

        // Convert IPFS hash to bytes32 for blockchain storage
        const documentHash = keccak256(toUtf8Bytes(ipfsHash));

        // Call the uploadDocument function from DocumentManagement contract
        const tx = await documentManagementContract.uploadDocument(documentHash, ipfsHash);
        await tx.wait();

        alert("Document uploaded to the blockchain successfully!");
    } catch (error) {
        console.error("Error in uploadDocumentToBlockchain:", error);
        alert("Failed to upload document to the blockchain.");
    }
};