const fetch = require("node-fetch");
const EventSource = require("eventsource");
const sanitize = require("mongo-sanitize");
const TrainTicket = require("../models/TrainTickets");

const trains = {
  getAllTrainPositions: async function (io) {
    const query = `<REQUEST>
    <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
    <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
</REQUEST>`;

    const trainPositions = {};

    const response = await fetch(
      "https://api.trafikinfo.trafikverket.se/v2/data.json",
      {
        method: "POST",
        body: query,
        headers: { "Content-Type": "text/xml" },
      }
    );
    const result = await response.json();
    const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL;

    const eventSource = new EventSource(sseurl);

    eventSource.onopen = function () {
      console.log("Connection to server opened.");
    };

    io.on("connection", (socket) => {
      console.log("a user connected");

      eventSource.onmessage = function (e) {
        try {
          const parsedData = JSON.parse(e.data);

          if (parsedData) {
            const changedPosition =
              parsedData.RESPONSE.RESULT[0].TrainPosition[0];

            const matchCoords = /(\d*\.\d+|\d+),?/g;

            const position = changedPosition.Position.WGS84.match(matchCoords)
              .map((t) => parseFloat(t))
              .reverse();

            const trainObject = {
              trainnumber: changedPosition.Train.AdvertisedTrainNumber,
              position: position,
              timestamp: changedPosition.TimeStamp,
              bearing: changedPosition.Bearing,
              status: !changedPosition.Deleted,
              speed: changedPosition.Speed,
            };

            if (
              trainPositions.hasOwnProperty(
                changedPosition.Train.AdvertisedTrainNumber
              )
            ) {
              socket.emit("message", trainObject);
            }

            trainPositions[changedPosition.Train.AdvertisedTrainNumber] =
              trainObject;
          }
        } catch (e) {
          console.log(e);
        }

        return;
      };
    });

    eventSource.onerror = function (e) {
      console.log("EventSource failed.");
    };
  },

  getAllDelayedTrains: async function (res, body, path) {
    const query = `<REQUEST>
                  <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                  <QUERY objecttype="TrainAnnouncement" orderby='AdvertisedTimeAtLocation' schemaversion="1.8">
                        <FILTER>
                        <AND>
                            <EQ name="ActivityType" value="Avgang" />
                            <GT name="EstimatedTimeAtLocation" value="$now" />
                            <AND>
                                <GT name='AdvertisedTimeAtLocation' value='$dateadd(-00:15:00)' />
                                <LT name='AdvertisedTimeAtLocation'                   value='$dateadd(02:00:00)' />
                            </AND>
                        </AND>
                        </FILTER>
                        <INCLUDE>ActivityId</INCLUDE>
                        <INCLUDE>ActivityType</INCLUDE>
                        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
                        <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
                        <INCLUDE>AdvertisedTrainIdent</INCLUDE>
                        <INCLUDE>OperationalTrainNumber</INCLUDE>
                        <INCLUDE>Canceled</INCLUDE>
                        <INCLUDE>FromLocation</INCLUDE>
                        <INCLUDE>ToLocation</INCLUDE>
                        <INCLUDE>LocationSignature</INCLUDE>
                        <INCLUDE>TimeAtLocation</INCLUDE>
                        <INCLUDE>TrainOwner</INCLUDE>
                  </QUERY>
            </REQUEST>`;

    const response = fetch(
      "https://api.trafikinfo.trafikverket.se/v2/data.json",
      {
        method: "POST",
        body: query,
        headers: { "Content-Type": "text/xml" },
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        return res.json({
          data: result.RESPONSE.RESULT[0].TrainAnnouncement,
        });
      });
  },
  getAllCodes: async function (res, body, path) {
    const query = `<REQUEST>
                  <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                  <QUERY objecttype="ReasonCode" schemaversion="1">
                        <INCLUDE>Code</INCLUDE>
                        <INCLUDE>Level1Description</INCLUDE>
                        <INCLUDE>Level2Description</INCLUDE>
                        <INCLUDE>Level3Description</INCLUDE>
                  </QUERY>
            </REQUEST>`;

    const response = fetch(
      "https://api.trafikinfo.trafikverket.se/v2/data.json",
      {
        method: "POST",
        body: query,
        headers: { "Content-Type": "text/xml" },
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        return res.json({
          data: result.RESPONSE.RESULT[0].ReasonCode,
        });
      });
  },

  getAllTrainTickets: async function (res) {
    try {
      const tickets = await TrainTicket.find();
      res.status(200).json({ data: tickets });
    } catch (error) {
      res.status(500).json({
        errors: {
          status: 500,
          source: "/trains",
          title: "Database error",
          detail: "Failed to fetch tickets from the database",
        },
      });
    }
  },

  getSpecificTrainTickets: async function (res, train_nr, path) {
    const trainNr = sanitize(train_nr);
    if (!trainNr) {
      return res.status(400).json({
        errors: {
          status: 400,
          source: "/trains",
          title: "Attribute missing",
          detail: "Train number is required to fetch specific ticket",
        },
      });
    }
    try {
      const tickets = await TrainTicket.find({ trainNr: trainNr });
      if (tickets) {
        res.status(200).json({ data: tickets });
      } else {
        res.status(404).json({
          errors: {
            status: 404,
            source: "/trains" + path,
            title: "Not Found",
            detail: "Train tickets not found",
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        errors: {
          status: 500,
          source: "/trains" + path,
          title: "Database error",
          detail: "Failed to fetch specific tickets from the database",
        },
      });
    }
  },

  editSpecificTrainTickets: async function (res, ticket_id, body, path) {
    const ticketId = sanitize(ticket_id);
    const allowedUpdates = ["trainNr", "code"];
    const updates = {};

    for (let key of allowedUpdates) {
      if (body[key]) {
        updates[key] = sanitize(body[key]);
      }
    }

    if (!ticketId || Object.keys(updates).length === 0) {
      return res.status(400).json({
        errors: {
          status: 400,
          source: "/trains" + path,
          title: "Attributes missing",
          detail: "Ticket ID and update fields (trainNr or code) are required",
        },
      });
    }

    try {
      const ticket = await TrainTicket.findByIdAndUpdate(ticketId, updates, {
        new: true,
      });

      if (ticket) {
        res.status(200).json({ data: ticket });
      } else {
        res.status(404).json({
          errors: {
            status: 404,
            source: "/trains" + path,
            title: "Not Found",
            detail: "Ticket not found",
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        errors: {
          status: 500,
          source: "/trains" + path,
          title: "Database error",
          detail: "Failed to edit ticket in the database",
        },
      });
    }
  },

  deleteSpecificTrainTicket: async function (res, ticket_id, path) {
    const ticketId = sanitize(ticket_id);
    if (!ticketId) {
      return res.status(400).json({
        errors: {
          status: 400,
          source: "/trains" + path,
          title: "Attribute missing",
          detail: "Ticket ID is required to delete a ticket",
        },
      });
    }
    try {
      await TrainTicket.findByIdAndDelete(ticketId);
      res.status(200).json({ message: "Ticket deleted successfully!" });
    } catch (error) {
      res.status(500).json({
        errors: {
          status: 500,
          source: "/trains" + path,
          title: "Database error",
          detail: "Failed to delete ticket from the database",
        },
      });
    }
  },

  addSpecificTrainTicket: async function (res, train_nr, body, path) {
    const trainNr = sanitize(train_nr);
    const code = sanitize(body.code);

    if (!trainNr || !code) {
      return res.status(401).json({
        errors: {
          status: 401,
          source: "/trains" + path,
          title: "Attribute missing",
          detail:
            "An attribute is missing in body request, trainNr and code are required",
        },
      });
    }

    try {
      const newTicket = new TrainTicket({ trainNr, code });
      await newTicket.save();
      res.status(200).json({ message: "Ticket added successfully!" });
    } catch (error) {
      res.status(500).json({
        errors: {
          status: 500,
          source: "/trains" + path,
          title: "Database error",
          detail: "Failed to insert ticket into the database",
        },
      });
    }
  },
};

module.exports = trains;