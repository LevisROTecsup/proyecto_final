const express = require('express');
const router = express.Router();

const { isWebUserAuth } = require('../../middleware/authMiddleware');

const ThesisController = require("../../controllers/user/ThesisController");

router.get("/", ThesisController.getThesis);
router.get("/search", ThesisController.searchThesis);
router.get("/:fileId/download", ThesisController.getDownloadFile);
router.get("/:thesisId/show", isWebUserAuth, ThesisController.getShowThesis);

router.post("/:thesisId/review", isWebUserAuth, ThesisController.reviewThesis);

module.exports = router;