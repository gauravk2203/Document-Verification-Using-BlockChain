require('dotenv').config(); // Load environment variables from .env file
const { create } = require('ipfs-http-client');

// Initialize IPFS client with your local or remote IPFS node URL
const ipfs = create({ url: 'http://localhost:5001/api/v0' }); // Replace with your IPFS node URL if necessary

async function uploadToIPFS(file) {
  try {
    // Convert the buffer (received file) to a format IPFS accepts
    const fileAdded = await ipfs.add({
      path: file.originalname,
      content: file.buffer,
    });

    console.log("File uploaded to IPFS with CID:", fileAdded.cid.toString());

    // Return the CID
    return fileAdded.cid.toString();
  } catch (error) {
    console.error("Error uploading file to IPFS:", error.stack);
    throw new Error("IPFS upload failed");
  }
}

module.exports = { uploadToIPFS };
