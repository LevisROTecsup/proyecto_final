const express = require('express');
const router = express.Router();

const { isWebAdminAuth } = require('../../middleware/authMiddleware');

const ThesisController = require("../../controllers/admin/ThesisController");

router.get("/", isWebAdminAuth, ThesisController.getThesis);
router.get("/:thesisId/show", isWebAdminAuth, ThesisController.getShowThesis);

router.post("/", isWebAdminAuth, ThesisController.createThesis);
router.post("/:thesisId/update-file", isWebAdminAuth, ThesisController.updateThesisFile);

router.put("/:thesisId/update", isWebAdminAuth, ThesisController.updateThesis);

router.delete("/:thesisId/delete", isWebAdminAuth, ThesisController.deleteThesis);

module.exports = router;