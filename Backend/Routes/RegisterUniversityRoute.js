const express = require("express");
const router = express.Router();
const UniversityRegistrationController = require("../Controller/UniversityRegistrationController");
const checkAccessPermission = require("../Middleware/checkAccessPermission"); // Middleware for access control

// Define routes for university registration
router.post("/register", checkAccessPermission, UniversityRegistrationController.registerUniversity);  // Register a new university

// Additional routes for verification and retrieval of university details
router.get("/university/:id", UniversityRegistrationController.getUniversityDetails); // Retrieve university details by ID
router.put("/university/:id", checkAccessPermission, UniversityRegistrationController.updateUniversity); // Update university details
router.delete("/university/:id", checkAccessPermission, UniversityRegistrationController.deleteUniversity); // Delete a university record

module.exports = router;
