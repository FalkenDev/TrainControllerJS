import gql from "graphql-tag";
import { apolloClient } from "../main.js";
const token = localStorage.getItem("token");
const authHeader = token ? `Bearer ${token}` : "";

export const train_api = {
  fetchDelayedTrains: async () => {
    const GET_DELAYED_TRAINS = gql`
      query GetDelayedTrains {
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

    try {
      const { data } = await apolloClient.query({
        query: GET_DELAYED_TRAINS,
        context: {
          headers: {
            Authorization: authHeader,
          },
        },
      });

      return data.getDelayedTrains;
    } catch (error) {
      throw new Error(error);
    }
  },

  fetchCodes: async () => {
    const GET_ALL_CODES = gql`
      query GetAllCodes {
        getAllCodes {
          Code
          Level1Description
          Level2Description
          Level3Description
        }
      }
    `;

    try {
      const { data } = await apolloClient.query({
        query: GET_ALL_CODES,
        context: {
          headers: {
            Authorization: authHeader,
          },
        },
      });

      return data.getAllCodes;
    } catch (error) {
      throw new Error(error);
    }
  },

  fetchAllTickets: async () => {
    const GET_ALL_TICKETS = gql`
      query GetAllTickets {
        getAllTickets {
          id
          trainNr
          code
        }
      }
    `;

    try {
      const { data } = await apolloClient.query({
        query: GET_ALL_TICKETS,
        context: {
          headers: {
            Authorization: authHeader,
          },
        },
      });

      return data.getAllTickets;
    } catch (error) {
      throw new Error(error);
    }
  },

  fetchSpecificTickets: async (trainNr) => {
    const GET_SPECIFIC_TICKETS = gql`
      query GetSpecificTrainTickets($trainNr: String!) {
        getSpecificTrainTickets(trainNr: $trainNr) {
          id
          trainNr
          code
        }
      }
    `;

    try {
      const { data } = await apolloClient.query({
        query: GET_SPECIFIC_TICKETS,
        context: {
          headers: {
            Authorization: authHeader,
          },
        },
        variables: { trainNr: trainNr },
      });

      return data.getSpecificTrainTickets;
    } catch (error) {
      throw new Error(error);
    }
  },

  createTicket: async (trainNr, code) => {
    const POST_CREATE_TICKET = gql`
      mutation CreateTicket($trainTicketInput: TrainTicketInput!) {
        createTicket(TrainTicket: $trainTicketInput) {
          id
          trainNr
          code
        }
      }
    `;

    try {
      const { data } = await apolloClient.mutate({
        mutation: POST_CREATE_TICKET,
        context: {
          headers: {
            Authorization: authHeader,
          },
        },
        variables: {
          trainTicketInput: {
            trainNr: trainNr,
            code: code,
          },
        },
      });

      return data.createTicket;
    } catch (error) {
      throw new Error(error);
    }
  },

  deleteTicket: async (ticketId) => {
    console.log(ticketId);
    const DELETE_TICKET_MUTATION = gql`
      mutation DeleteTicket($id: ID!) {
        deleteTicket(id: $id)
      }
    `;

    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_TICKET_MUTATION,
        context: {
          headers: {
            Authorization: authHeader,
          },
        },
        variables: { id: ticketId },
      });

      if (data && data.deleteTicket === "Ticket successfully deleted!") {
        return { message: "Ticket successfully deleted!" };
      } else {
        throw new Error("Failed to delete ticket");
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  editTicket: async (ticketId, code) => {
    const EDIT_TICKET_MUTATION = gql`
      mutation EditTicket($id: ID!, $TrainTicket: TrainTicketInput!) {
        editTicket(id: $id, TrainTicket: $TrainTicket) {
          id
          trainNr
          code
        }
      }
    `;

    try {
      const { data } = await apolloClient.mutate({
        mutation: EDIT_TICKET_MUTATION,
        context: {
          headers: {
            Authorization: authHeader,
          },
        },
        variables: {
          id: ticketId,
          TrainTicket: {
            code: code,
          },
        },
      });

      if (data && data.editTicket) {
        return data.editTicket;
      } else {
        throw new Error("Failed to edit ticket");
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};
