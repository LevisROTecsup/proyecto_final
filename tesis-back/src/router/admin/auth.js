const express = require('express');
const router = express.Router();

const { isWebAdminAuth } = require('../../middleware/authMiddleware');

const AuthController = require("../../controllers/admin/AuthController");

router.get("/me", isWebAdminAuth, AuthController.me);

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

module.exports = router;