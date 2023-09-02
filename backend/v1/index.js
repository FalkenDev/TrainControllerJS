const express = require("express");
const path = require("path");
const router = express.Router();
const routeTrains = require("./routes/trains");

router.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/documentation/documentation.html"))
);

router.use("/trains", routeTrains);

router.use(function (req, res) {
  return res.status(404).json({
    errors: {
      status: 404,
      source: req.path,
      title: "Not found",
      detail: "Could not find path: " + req.path,
    },
  });
});

module.exports = router;
