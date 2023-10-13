const fetch = require("node-fetch");

let stationMappingCache = null;
const cacheExpirationTime = 24 * 60 * 60 * 1000; // 24 hours
let cacheSetTime = null;

const stations = {
  getStations: async function (res, body, path) {
    const query = `<REQUEST>
              <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
              <QUERY objecttype="TrainStation" schemaversion="1.0">
                <INCLUDE>LocationSignature</INCLUDE>
                <INCLUDE>AdvertisedLocationName</INCLUDE>
                <INCLUDE>AdvertisedShortLocationName</INCLUDE>
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
        console.log(result.RESPONSE.RESULT[0]);
        return res.json({
          data: result.RESPONSE.RESULT[0],
        });
      });
  },
  getAllStations: async function () {
    const currentTime = new Date().getTime();

    if (
      stationMappingCache &&
      cacheSetTime &&
      currentTime - cacheSetTime < cacheExpirationTime
    ) {
      return stationMappingCache;
    }

    const query = `<REQUEST>
              <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
              <QUERY objecttype="TrainStation" schemaversion="1.0">
                <INCLUDE>LocationSignature</INCLUDE>
                <INCLUDE>AdvertisedLocationName</INCLUDE>
                <INCLUDE>AdvertisedShortLocationName</INCLUDE>
              </QUERY>
            </REQUEST>`;

    return fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/xml" },
    })
      .then((response) => response.json())
      .then((result) => {
        const mapping = {};
        for (let station of result.RESPONSE.RESULT[0].TrainStation) {
          mapping[station.LocationSignature] = station.AdvertisedLocationName;
        }

        stationMappingCache = mapping;
        cacheSetTime = currentTime;

        return mapping;
      });
  },
};
module.exports = stations;
