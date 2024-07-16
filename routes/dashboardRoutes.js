const express = require("express");
const router = express.Router();

const { getDashboard, displayAll } = require("../controller/dashboardController");

router.route("/").get(getDashboard);
router.route("/dispaly-all").get(displayAll);

module.exports = router;
