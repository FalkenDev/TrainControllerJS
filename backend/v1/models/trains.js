const fetch = require("node-fetch");

const EventSource = require("eventsource");
const sanitize = require("mongo-sanitize"); // To prevent malicious users overwriting (NoSQL Injection)
const { MongoClient, ObjectId } = require("mongodb");

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
  getAllTrainTickets: async function (res, body, path) {},
  getSpecificTrainTickets: async function (res, body, path) {},
  EditSpecificTrainTickets: async function (res, body, path) {},
  deleteSpecificTrainTicket: async function (res, body, path) {},
};

module.exports = trains;
