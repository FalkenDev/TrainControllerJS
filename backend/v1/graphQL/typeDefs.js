const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type TrainTicket {
    id: ID
    trainNr: String
    code: String
  }

  type Codes {
    Code: String
    Level1Description: String
    Level2Description: String
    Level3Description: String
  }

  type FromLocation {
    LocationName: String
    Priority: Int
    Order: Int
  }

  type ToLocation {
    LocationName: String
    Priority: Int
    Order: Int
  }

  type TrainInfo {
    ActivityId: String
    ActivityType: String
    AdvertisedTimeAtLocation: String
    AdvertisedTrainIdent: String
    Canceled: Boolean
    EstimatedTimeAtLocation: String
    LocationSignature: String
    OperationalTrainNumber: String
    FromLocation: [FromLocation]
    ToLocation: [ToLocation]
    TimeAtLocation: String
    TrainOwner: String
  }

  type User {
    id: ID
    email: String
  }

  type RegisterUser {
    email: String
    password: String
  }

  type RegisterResponse {
    message: String!
  }

  type LoginUser {
    email: String
    password: String
  }

  type LoginResponse {
    token: String
  }

  type Query {
    getAllTickets: [TrainTicket]
    getSpecificTrainTickets(trainNr: String): [TrainTicket]
    getAllCodes: [Codes]
    getDelayedTrains: [TrainInfo]
    getUserData: User
  }

  input TrainTicketInput {
    trainNr: String
    code: String
  }

  input RegisterInput {
    email: String
    password: String
  }
  input LoginInput {
    email: String
    password: String
  }
  input GetUserDataInput {
    token: String
  }

  type Mutation {
    createTicket(TrainTicket: TrainTicketInput): TrainTicket
    deleteTicket(id: ID): String
    editTicket(id: ID, TrainTicket: TrainTicketInput): TrainTicket
    registerUser(RegisterUser: RegisterInput): RegisterResponse
    loginUser(LoginUser: LoginInput): LoginResponse
  }
`;

module.exports = typeDefs;
