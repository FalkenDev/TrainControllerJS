const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("../graphQL/typeDefs");
const resolvers = require("../graphQL/resolvers");
const authController = require("../controllers/auth");
const TrainTicketModel = require("../models/TrainTickets");
const trainsController = require("../controllers/trains");
const { createTestClient } = require("apollo-server-testing");

jest.mock("../controllers/auth");
jest.mock("../models/TrainTickets");
jest.mock("../controllers/trains");

let server;
let query;
let mutate;

beforeAll(async () => {
  server = new ApolloServer({ typeDefs, resolvers });
  const client = createTestClient(server);
  query = client.query;
  mutate = client.mutate;
});

describe("Tickets GraphQL", () => {
  it("Test with return all tickets", async () => {
    TrainTicketModel.find = jest.fn();
    authController.checkAuthToken.mockResolvedValue(true);
    TrainTicketModel.find.mockResolvedValue([
      { id: "1", trainNr: "TestGraphQL", code: "Test1" },
    ]);

    const GET_ALL_TICKETS = `
    query {
        getAllTickets {
            id
            trainNr
            code
        }
    }
    `;

    const response = await query({ query: GET_ALL_TICKETS });
    expect(response.data.getAllTickets).toEqual([
      { id: "1", trainNr: "TestGraphQL", code: "Test1" },
    ]);
  });

  it("Test with return specific train tickets by its trainNr", async () => {
    TrainTicketModel.find = jest.fn();
    const mockTicket = [
      { id: "22", trainNr: "TestGraphQL20", code: "Test2" },
      { id: "24", trainNr: "TestGraphQL20", code: "Test2" },
    ];
    authController.checkAuthToken.mockResolvedValue(true);

    TrainTicketModel.find = jest.fn((query) => {
      const mockDB = [
        { id: "21", trainNr: "TestGraphQL2", code: "Test2" },
        { id: "22", trainNr: "TestGraphQL20", code: "Test2" },
        { id: "23", trainNr: "TestGraphQL200", code: "Test2" },
        { id: "24", trainNr: "TestGraphQL20", code: "Test2" },
      ];
      const filtered = mockDB.filter(
        (ticket) => ticket.trainNr === query.trainNr
      );
      return Promise.resolve(filtered);
    });

    const GET_TICKETS_BY_TRAIN_NR = `
    query {
        getSpecificTrainTickets(trainNr: "TestGraphQL20") {
            id
            trainNr
            code
        }
    }
    `;

    const response = await query({ query: GET_TICKETS_BY_TRAIN_NR });

    expect(response.data.getSpecificTrainTickets).toEqual(mockTicket);
  });

  it("Test with create a ticket", async () => {
    const CREATE_A_TICKET = `
      mutation {
        createTicket(TrainTicket: { trainNr: "TestGraphQL30", code: "Test3" }) {
          id
          trainNr
          code
        }
      }
    `;

    authController.checkAuthToken.mockResolvedValue(true);
    TrainTicketModel.prototype.save = jest.fn().mockResolvedValue({
      id: 303,
      trainNr: "TestGraphQL30",
      code: "Test3",
    });

    const response = await mutate({ mutation: CREATE_A_TICKET });
    expect(response.data.createTicket).toEqual({
      id: "303",
      trainNr: "TestGraphQL30",
      code: "Test3",
    });
  });

  it("Test with edit a tickets", async () => {
    TrainTicketModel.findByIdAndUpdate; = jest.fn();
    const EDIT_A_TICKET = `
    mutation {
        editTicket(id: "22", TrainTicket: { trainNr: "TestGraphQL30", code: "Test3" }) {
            id
            trainNr
            code
        }
    }
    `;

    authController.checkAuthToken.mockResolvedValue(true);
    TrainTicketModel.findByIdAndUpdate.mockResolvedValue({
      id: "22",
      trainNr: "TestGraphQL404",
      code: "Test44",
    });

    const response = await mutate({ mutation: EDIT_A_TICKET });
    expect(response.data.editTicket).toEqual({
      id: "22",
      trainNr: "TestGraphQL404",
      code: "Test44",
    });
  });

  it("Test to delete a tickets", async () => {
    const DELETE_A_TICKET = `
      mutation {
        deleteTicket(id: "22")
      }
    `;

    authController.checkAuthToken.mockResolvedValue(true);
    TrainTicketModel.findByIdAndDelete = jest.fn().mockResolvedValue({
      id: "22",
      trainNr: "TestGraphQL404",
      code: "Test44",
    });

    const response = await mutate({ mutation: DELETE_A_TICKET });
    expect(response.data.deleteTicket).toEqual("Ticket successfully deleted!");
  });

  it("Test auth (not authenticated) when handling tickets", async () => {
    const GET_ALL_TICKETS = `
    query {
        getAllTickets {
            id
            trainNr
            code
        }
    }
    `;

    authController.checkAuthToken.mockResolvedValue(false);
    const response = await query({ query: GET_ALL_TICKETS });

    expect(response.errors[0].message).toEqual("Not authenticated!");
  });
});

describe("Train Information", () => {
  it("Test get delayed trains", async () => {
    const mockDelayedTrains = [
      {
        ActivityId: "1",
        ActivityType: "Arrival",
        AdvertisedTimeAtLocation: "10:00",
        AdvertisedTrainIdent: "2343",
        Canceled: false,
        EstimatedTimeAtLocation: "11:05",
        LocationSignature: "StationA",
        OperationalTrainNumber: "2343",
        FromLocation: [
          {
            LocationName: "Stockholm",
            Priority: 1,
            Order: 1,
          },
        ],
        ToLocation: [
          {
            LocationName: "Halmstad",
            Priority: 2,
            Order: 2,
          },
        ],
        TimeAtLocation: "10:05",
        TrainOwner: "Vasttrafik",
      },
    ];

    trainsController.getAllDelayedTrains.mockResolvedValue(mockDelayedTrains);

    const GET_DELAYED_TRAINS = `
    query {
        getDelayedTrains {
            ActivityId
            ActivityType
            AdvertisedTimeAtLocation
            AdvertisedTrainIdent
            Canceled
            EstimatedTimeAtLocation
            LocationSignature
            OperationalTrainNumber
            FromLocation {
                LocationName
                Priority
                Order
            }
            ToLocation {
                LocationName
                Priority
                Order
            }
            TimeAtLocation
            TrainOwner
        }
    }
    `;

    const response = await query({ query: GET_DELAYED_TRAINS });

    expect(response.data.getDelayedTrains).toEqual(mockDelayedTrains);
  });

  it("Test get train codes", async () => {
    const mockTrainCodes = [];
  });
});

describe("Authentication", () => {
  it("Test login (sucess)", async () => {});
  it("Test login (failed)", async () => {});
  it("Test register", async () => {});
  it("Test get user data", async () => {});
});

afterAll(async () => {
  jest.clearAllMocks();
});
