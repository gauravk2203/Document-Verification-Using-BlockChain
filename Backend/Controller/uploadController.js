const { uploadToIPFS } = require("../Services/ipfsService");

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    // File type validation (e.g., PDF or DOCX)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).send("Invalid file type. Only PDF and DOCX files are allowed.");
    }

    // File size validation (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).send("File size exceeds the maximum allowed limit of 10MB.");
    }

    console.log("File received:", req.file); // For debugging

    // Attempt to upload to IPFS (NFT.Storage)
    const ipfsResponse = await uploadToIPFS(req.file);
    console.log("IPFS upload successful:", ipfsResponse);

    // Send success response with CID from NFT.Storage
    res.status(200).json({ message: "File uploaded to IPFS/Filecoin", data: { cid: ipfsResponse } });
  } catch (error) {
    console.error("Error uploading document:", error.stack); // Log detailed error
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
