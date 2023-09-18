const express = require("express");
const router = express.Router();
const trainController = require("../controllers/trains");

router.get("/delayed", (req, res) =>
  trainController.getAllDelayedTrains(res, req.body, req.path)
);

router.get("/codes", (req, res) => trainController.getAllCodes(res, req.body));

router.get("/tickets", (req, res) =>
  trainController.getAllTrainTickets(res, req.body, req.path)
);

router.get("/tickets/:trainNr", (req, res) =>
  trainController.getSpecificTrainTickets(res, req.params.trainNr, req.path)
);

router.post("/tickets/:trainNr", (req, res) =>
  trainController.addSpecificTrainTicket(
    res,
    req.params.trainNr,
    req.body,
    req.path
  )
);

router.put("/tickets/:ticketId", (req, res) =>
  trainController.editSpecificTrainTickets(
    res,
    req.params.ticketId,
    req.body,
    req.path
  )
);

router.delete("/tickets/:ticketId", (req, res) =>
  trainController.deleteSpecificTrainTicket(res, req.params.ticketId, req.path)
);

module.exports = router;
