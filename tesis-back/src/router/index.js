const express = require('express');
const router = express.Router();

const authAdmin = require("./admin/auth");
const thesisAdmin = require("./admin/thesis");

const authUser = require("./user/auth");
const thesisUser = require("./user/thesis");

router.use("/admin/auth", authAdmin);
router.use("/admin/thesis", thesisAdmin);

router.use("/user/auth", authUser);
router.use("/user/thesis", thesisUser);

module.exports = router;