module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("ticketHandling", (trainId) => {
      const roomExists = io.sockets.adapter.rooms.has(trainId);
      if (!roomExists) {
        console.log("A user has joined a ticket room for train: ", trainId);
        socket.join(trainId);
        socket.emit("ticketHandling", `Access to handling train ${trainId}`);
      } else {
        console.log(
          "A user is trying to joing ticket room for train: ",
          trainId,
          ". But it's full!"
        );
        socket.emit(
          "ticketHandlingFull",
          `Train ${trainId} is currently being handled by another user.`
        );
      }
    });

    socket.on("ticketHandlingLeave", (trainId) => {
      console.log("A user leaved ticket room for trainId:", trainId);
      socket.leave(trainId);
    });
  });
};
