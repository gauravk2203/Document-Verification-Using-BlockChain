const express = require("express");
const router = express.Router();
const AccessControlController = require("../Controller/acessControlController");
const checkAccessPermission = require("../Middlewares/checkAccessPermission"); // Import the middleware

// Define routes for access control
router.post("/upload-document", checkAccessPermission, AccessControlController.uploadDocument);
// You can add more routes that use the same middleware for access control
router.get("/verify-document/:id", checkAccessPermission, AccessControlController.verifyDocument);

module.exports = router;
