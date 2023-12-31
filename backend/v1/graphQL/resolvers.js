const TrainTicket = require("../models/TrainTickets");
const trainsController = require("../controllers/trains");
const authController = require("../controllers/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    getAllTickets: async (_parent, _args, context, _info) => {
      if (await authController.checkAuthToken(context)) {
        return await TrainTicket.find();
      } else {
        throw new AuthenticationError("Not authenticated!");
      }
    },
    getSpecificTrainTickets: async (_parent, { trainNr }, context, _info) => {
      if (await authController.checkAuthToken(context)) {
        return await TrainTicket.find({ trainNr: trainNr });
      } else {
        throw new AuthenticationError("Not authenticated!");
      }
    },
    getAllCodes: async (_parent, _args, context, _info) => {
      if (await authController.checkAuthToken(context)) {
        return await trainsController.getAllCodes();
      } else {
        throw new AuthenticationError("Not authenticated!");
      }
    },
    getDelayedTrains: async () => {
      return await trainsController.getAllDelayedTrains();
    },
    getUserData: async (_parent, _args, context, _info) => {
      return await authController.getUserDataGraphQL(context);
    },
  },
  Mutation: {
    createTicket: async (_parent, args, context, _info) => {
      if (await authController.checkAuthToken(context)) {
        const { trainNr, code } = args.TrainTicket;
        const trainTicket = new TrainTicket({ trainNr, code });
        const savedTicket = await trainTicket.save();

        return savedTicket;
      } else {
        throw new AuthenticationError("Not authenticated!");
      }
    },
    deleteTicket: async (_parent, args, context, _info) => {
      if (await authController.checkAuthToken(context)) {
        const { id } = args;
        await TrainTicket.findByIdAndDelete(id);
        return "Ticket successfully deleted!";
      } else {
        throw new AuthenticationError("Not authenticated!");
      }
    },
    editTicket: async (_parent, args, context, _info) => {
      if (await authController.checkAuthToken(context)) {
        const { id } = args;
        const { trainNr, code } = args.TrainTicket;
        const updates = {};
        if (trainNr !== undefined) {
          updates.trainNr = trainNr;
        }
        if (code !== undefined) {
          updates.code = code;
        }
        const trainTicket = await TrainTicket.findByIdAndUpdate(id, updates, {
          new: true,
        });

        return trainTicket;
      } else {
        throw new AuthenticationError("Not authenticated!");
      }
    },
    registerUser: async (_parent, args, _context, _info) => {
      return await authController.registerUserGraphQL(args.RegisterUser);
    },
    loginUser: async (_parent, args, _context, _info) => {
      try {
        return await authController.loginUserGraphQL(args.LoginUser);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
