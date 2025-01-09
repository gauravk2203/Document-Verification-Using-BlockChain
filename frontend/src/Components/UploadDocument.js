import React, { useState } from "react";
import axios from "axios";

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setMessage("File size exceeds 5MB limit");
      return;
    }

    const formData = new FormData(); 
    formData.append("document", file);

    try {
const response = await axios.post("http://localhost:3000/api/documents/upload-document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Upload successful!");
      setIpfsHash(response.data.data.cid);
    } catch (error) {
      console.error(error);
      setMessage("Error uploading document");
    }
  };

  return (
    <div>
      <h1>Upload Document</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
      {ipfsHash && (
        <p>
          IPFS Hash: <a href={`https://ipfs.io/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer">{ipfsHash}</a>
        </p>
      )}
    </div>
  );
};

export default DocumentUpload;
