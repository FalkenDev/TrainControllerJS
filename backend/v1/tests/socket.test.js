const io = require("socket.io-client");
const http = require("http");
const ioBack = require("socket.io");

let socket;
let httpServer;
let httpServerAddr;
let ioServer;

// Setup
beforeAll(async () => {
  httpServer = http.createServer();
  httpServerAddr = httpServer.listen().address();
  ioServer = ioBack(httpServer);
  require("../sockets/ticketHandling")(ioServer);
});

// Cleanup
afterAll(async () => {
  if (ioServer) ioServer.close();
  if (httpServer) httpServer.close();
});

// Before each test
beforeEach(async () => {
  await new Promise((resolve) => {
    socket = io.connect(`http://[::]:${httpServerAddr.port}`, {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
      transports: ["websocket"],
    });
    socket.on("connect", resolve);
    socket.on("connect_error", (err) => {
      reject(new Error(`Socket connection error: ${err.message}`));
    });
  });
  socket.removeAllListeners();
});

// Cleanup after each test
afterEach(async () => {
  if (socket.connected) {
    await new Promise((resolve, reject) => {
      socket.on("disconnect", resolve);
      socket.on("disconnect_error", (err) => {
        reject(new Error(`Socket disconnection error: ${err.message}`));
      });
      socket.disconnect();
    });
  }
});

describe("Socket Test TicketHandling", () => {
  it("Test connect to a ticket room that is empty", async () => {
    return new Promise((resolve, reject) => {
      socket.on("ticketHandling", (message) => {
        try {
          expect(message).toBe("Access to handling train Train1");
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      socket.on("ticketHandlingFull", (message) => {
        reject(new Error(message));
      });

      socket.emit("ticketHandling", "Train1");
    });
  });

  it("Test connect to a ticket room that is full", async () => {
    return new Promise((resolve, reject) => {
      socket.on("ticketHandlingFull", (message) => {
        try {
          expect(message).toBe(
            "Train Train2 is currently being handled by another user."
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      socket.emit("ticketHandling", "Train2"); // First try
      socket.emit("ticketHandling", "Train2"); // Second try
    });
  });

  it("Test leave a ticket room", async () => {
    let times = 0;
    return new Promise((resolve, reject) => {
      socket.on("ticketHandlingFull", (message) => {
        reject(new Error(message)); // ticketHandlingFull should not be called
      });
      socket.on("ticketHandling", () => {
        times += 1;
        if (times === 1) {
          socket.emit("ticketHandlingLeave", "Train3"); // Leave the room
          socket.emit("ticketHandling", "Train3"); // Second try
        } else if (times === 2) {
          resolve(); // Success (Second try can join the room = leave was successful)
        }
      });

      socket.emit("ticketHandling", "Train3"); // First try
    });
  });
});
