const express = require("express");
const router = express.Router();
const traindModel = require("../models/trains.js");

router.get("/all", (req, res) => traindModel.getAllTrainPositions(res));

router.get("/delayed", (req, res) =>
  traindModel.getAllDelayedTrains(res, req.body)
);

router.get("/codes", (req, res) => traindModel.getAllCodes(res, req.body));

router.get("/tickets", (req, res) =>
  traindModel.getAllTrainTickets(res, req.body)
);

router.get("/tickets/:trainId", (req, res) =>
  traindModel.getSpecificTrainTickets(res, req.body)
);

router.put("/tickets/:trainId/:trainTicket", (req, res) =>
  traindModel.EditSpecificTrainTickets(res, req.body)
);

router.delete("/tickets/:trainId/:trainTicket", (req, res) =>
  traindModel.deleteSpecificTrainTicket(res, req.body)
);

module.exports = router;
