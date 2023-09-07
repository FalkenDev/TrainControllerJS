const TrainTicket = require("../models/TrainTickets");
const resolvers = {
  Query: {
    getAllTickets: async () => {
      return await TrainTicket.find();
    },
    getSpecificTrainTickets: async (_parent, { trainNr }, _context, _info) => {
      return await TrainTicket.find({ trainNr: trainNr });
    },
  },
  Mutation: {
    createTicket: async (_parent, args, _context, _info) => {
      const { trainNr, code } = args.TrainTicket;
      const trainTicket = new TrainTicket({ trainNr, code });
      await trainTicket.save();
      return trainTicket;
    },
    deleteTicket: async (_parent, args, _context, _info) => {
      const { id } = args;
      await TrainTicket.findByIdAndDelete(id);
      return "Ticket successfully deleted!";
    },
    editTicket: async (_parent, args, _context, _info) => {
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
    },
  },
};

module.exports = resolvers;
