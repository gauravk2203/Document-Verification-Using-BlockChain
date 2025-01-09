const express = require("express");
const documentController = require("../Controller/uploadController");
const fileUpload = require("../Middleware/fileUploadMiddleware");

const router = express.Router();

router.post("/upload", fileUpload, documentController.uploadDocument);

module.exports = router;
