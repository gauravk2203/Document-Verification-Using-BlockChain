const express = require("express");
const router = express.Router();
const DocumentManagementController = require("../Controller/DocumentManagementController");
const checkAccessPermission = require("../Middlewares/checkAccessPermission"); // Assuming middleware for access control

// Define routes for document management
router.post("/upload-document", checkAccessPermission, DocumentManagementController.uploadDocument); 
// Additional routes can be added as needed
router.get("/document/:id", DocumentManagementController.getDocument);  // Route to retrieve document details
router.put("/document/:id", checkAccessPermission, DocumentManagementController.updateDocument);  // Update document info
router.delete("/document/:id", checkAccessPermission, DocumentManagementController.deleteDocument); // Delete document

module.exports = router;
