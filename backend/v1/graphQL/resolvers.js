const TrainTicket = require("../models/TrainTickets");
const trainsController = require("../controllers/trains");
const authController = require("../controllers/auth");
const resolvers = {
  Query: {
    getAllTickets: async (_parent, _args, context, _info) => {
      if (await authController.checkAuthToken(context)) {
        return await TrainTicket.find();
      }
    },
    getSpecificTrainTickets: async (_parent, { trainNr }, context, _info) => {
      if (await authController.checkAuthToken(context)) {
        return await TrainTicket.find({ trainNr: trainNr });
      }
    },
    getAllCodes: async (_parent, _args, context, _info) => {
      if (await authController.checkAuthToken(context)) {
        return await trainsController.getAllCodes();
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
        await trainTicket.save();
        return trainTicket;
      }
    },
    deleteTicket: async (_parent, args, context, _info) => {
      if (await authController.checkAuthToken(context)) {
        const { id } = args;
        await TrainTicket.findByIdAndDelete(id);
        return "Ticket successfully deleted!";
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
      }
    },
    registerUser: async (_parent, args, _context, _info) => {
      await authController.registerUserGraphQL(args.RegisterUser);
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
