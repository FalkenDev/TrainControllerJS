require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cluster = require("cluster");
const filter = require("content-filter");
const { ApolloServer, gql } = require("apollo-server-express");
const typeDefs = require("./v1/graphQL/typeDefs");
const resolvers = require("./v1/graphQL/resolvers");

const database = require("./db/database");
const v1 = require("./v1/index.js");

const RateLimit = require("express-rate-limit");
const trains = require("./v1/controllers/trains");

const apiLimiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
});

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

const app = express();

app.use(apiLimiter);
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(require("morgan")("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(filter());
app.use("/v1", v1);
database.connect;

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const port = process.env.PORT || 8393;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: {
    settings: {
      "schema.polling.enable": false,
    },
  },
});

async function serverStart() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

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
        console.log(
          `Worker ID ${process.pid}, is running on http://localhost:` +
            port +
            "/v1"
        )
      );
    }
  } else {
    httpServer.listen(port, () =>
      console.log(`Server is running on http://localhost:` + port + "/v1")
    );
  }

  trains.getAllTrainPositions(io);
}

serverStart();
