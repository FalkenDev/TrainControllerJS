const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type TrainTicket {
    id: ID
    trainNr: String
    code: String
  }

  type Query {
    getAllTickets: [TrainTicket]
    getSpecificTrainTickets(trainNr: String): [TrainTicket]
  }

  input TrainTicketInput {
    trainNr: String
    code: String
  }

  type Mutation {
    createTicket(TrainTicket: TrainTicketInput): TrainTicket
    deleteTicket(id: ID): String
    editTicket(id: ID, TrainTicket: TrainTicketInput): TrainTicket
  }
`;

module.exports = typeDefs;
