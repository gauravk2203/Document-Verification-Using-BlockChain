import { ethers } from "ethers";
import { universityRegistrationAddress, universityRegistrationABI } from "../ABIfolder/Contractconfig";
import { getProviderAndSigner } from "./etherSetup";



const getContractInstance = async () => {
    const { signer } = await getProviderAndSigner();
    return new ethers.Contract(universityRegistrationAddress, universityRegistrationABI, signer);
};

export const registerUniversity = async (name, location, collegeCode) => {
    try {
        const universityRegistrationContract = await getContractInstance();
        const tx = await universityRegistrationContract.registerUniversity(name, location, collegeCode);
        console.log(tx);
        await tx.wait();
        alert("University registered successfully!");
    } catch (error) {
        console.error("Error in registerUniversity:", error);
        alert("Failed to register university.");
    }
};

export const getUniversity = async (_universityAddress) => {
    try {
        const provider = await getProviderAndSigner();
        let universityAddress = _universityAddress;

        // If the input is an ENS name (e.g., "myuniversity.eth"), resolve it to an Ethereum address
        if (_universityAddress.includes(".eth")) {
            try {
                universityAddress = await provider.resolveName(_universityAddress);
            } catch (error) {
                console.error("ENS resolution failed:", error);
                alert("ENS resolution failed, please enter a valid Ethereum address.");
                return;
            }
        }

        // Basic Ethereum address validation (without ethers.utils)
        const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!ethAddressRegex.test(universityAddress)) {
            alert("Please enter a valid Ethereum address.");
            return;
        }

        // Proceed with getting the university details using the valid address
        const universityRegistrationContract = await getContractInstance();
        const tx = await universityRegistrationContract.getUniversity(universityAddress);
        console.log(tx);
        alert("Successfully fetched university data");
    } catch (error) {
        console.error("Error in getUniversity:", error);
        alert("Failed to fetch university data.");
    }
};


export const revokeUniversity = async (_universityAddress) => {
    try {
        const universityRegistrationContract = await getContractInstance();
        const tx = await universityRegistrationContract.revokeUniversity(_universityAddress);
        await tx.wait();
        alert("University has been revoked");
    } catch (error) {
        console.error("Error in revokeUniversity:", error);
        alert("Failed to revoke university.");
    }
};

export const verifyUniversity = async (_universityAddress) => {
    try {
        const universityRegistrationContract = await getContractInstance();
        const tx = await universityRegistrationContract.verifyUniversity(_universityAddress);
        await tx.wait();
        alert("University verified successfully!");
    } catch (error) {
        console.error("Error in verifyUniversity:", error);
        alert("Failed to verify university.");
    }
};

// call it after generating the hash of the document
export const uploadDoc = async (_documentHash) => {
    try {
        const universityRegistrationContract = await getContractInstance();
        const tx = await universityRegistrationContract.uploadDocument(_documentHash);
        await tx.wait();
        alert("Document uploaded successfully!");
    } catch (error) {
        console.error("Error in uploadDoc:", error);
        alert("Failed to upload document.");
    }
};

export const changeAdmin = async (newAdmin) => {
    try {
        const universityRegistrationContract = await getContractInstance();
        const tx = await universityRegistrationContract.changeAdmin(newAdmin);
        await tx.wait();
        alert("Admin has been changed successfully!");
    } catch (error) {
        console.error("Error in changeAdmin:", error);
        alert("Failed to change admin.");
    }
};
