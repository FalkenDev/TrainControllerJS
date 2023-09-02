const mongoose = require("mongoose");

const TrainTicketSchema = new mongoose.Schema(
  {
    trainNr: String,
    code: String,
  },
  {
    timestamps: true,
  }
);

const TrainTicket = mongoose.model("tickets", TrainTicketSchema);
module.exports = TrainTicket;
