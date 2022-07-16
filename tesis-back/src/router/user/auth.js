const express = require('express');
const router = express.Router();

const { isWebUserAuth } = require('../../middleware/authMiddleware');

const AuthController = require("../../controllers/user/AuthController");

router.get("/me", isWebUserAuth, AuthController.me);

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

module.exports = router;