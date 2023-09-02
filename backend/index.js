require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cluster = require("cluster");
const filter = require("content-filter");

const database = require("./db/database");
const v1 = require("./v1/index.js");

const RateLimit = require("express-rate-limit");
const trains = require("./v1/models/trains");
const apiLimiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(apiLimiter);
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.use(cors({ origin: [""], credentials: true }));
app.options("*", cors());
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(require("morgan")("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(filter());
app.use("/v1", v1);
database.run;

const httpServer = require("http").createServer(app); // Create an HTTP server

const io = require("socket.io")(httpServer, {
  // Attach Socket.io to the server
  cors: {
    origin: "http://localhost:9000",
    methods: ["GET", "POST"],
  },
});

const port = process.env.REST_API_PORT || 8393;

if (process.env.API_CLUSTER) {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    var cpuCount = require("os").cpus().length;
    console.log(`Total CPU ${cpuCount}`);

    for (var worker = 0; worker < cpuCount; worker += 1) {
      cluster.fork();
    }

    cluster.on("exit", function () {
      cluster.fork();
    });
  } else {
    httpServer.listen(port, () =>
      // Use httpServer here
      console.log(
        `Worker ID ${process.pid}, is running on http://localhost:` +
          port +
          "/v1"
      )
    );
  }
} else {
  httpServer.listen(port, () =>
    // Use httpServer here
    console.log(
      `Worker ID ${process.pid}, is running on http://localhost:` + port + "/v1"
    )
  );
}

trains.getAllTrainPositions(io);
