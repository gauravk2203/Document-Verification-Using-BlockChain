const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    
    // Step 1: Deploy UniversityRegistration with a placeholder address for DocumentManagement
    const dummyAddress = "0x0000000000000000000000000000000000000000"; // Placeholder address
    const UniversityRegistration = await ethers.getContractFactory("UniversityRegistration");
    const universityRegistration = await UniversityRegistration.deploy(dummyAddress);
    
    // Wait for the transaction to be mined
    await universityRegistration.waitForDeployment();
    console.log("UniversityRegistration deployed to:", universityRegistration.getAddress());

    // Step 2: Deploy DocumentManagement with the UniversityRegistration address
    const DocumentManagement = await ethers.getContractFactory("DocumentManagement");
    const documentManagement = await DocumentManagement.deploy(universityRegistration.getAddress());
    
    // Wait for the transaction to be mined
    await documentManagement.waitForDeployment();
    console.log("DocumentManagement deployed to:", documentManagement.getAddress());

    // Step 3: Update UniversityRegistration with the actual DocumentManagement address
    await universityRegistration.setDocumentManagementSystem(documentManagement.getAddress());
    console.log("DocumentManagement address set in UniversityRegistration.");
}

// Execute the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

