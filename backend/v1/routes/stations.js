const express = require("express");
const router = express.Router();
const stationController = require("../controllers/stations");

router.get("/all", (req, res) =>
  stationController.getStations(res, req.body, req.path)
);

module.exports = router;
