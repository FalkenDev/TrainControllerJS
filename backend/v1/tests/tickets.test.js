const trains = require("../controllers/trains");
const TrainTicket = require("../models/TrainTickets");

jest.mock("../models/TrainTickets");

describe("Train Controller Tests with tickets", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("Test create a ticket - Valid", async () => {
    TrainTicket.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
    }));

    await trains.addSpecificTrainTicket(
      mockRes, // Res
      "1", // trainNr
      { code: "A123" }, // Body
      "" // Path
    );
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Ticket added successfully!",
    });
  });

  test("Test create a ticket - Not valid", async () => {
    await trains.addSpecificTrainTicket(mockRes, null, { code: "A123" }, "");
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.objectContaining({
          title: "Attribute missing",
        }),
      })
    );
  });

  test("Test create a ticket - Database Error", async () => {
    TrainTicket.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Database error")),
    }));

    await trains.addSpecificTrainTicket(mockRes, "1", { code: "A123" }, "");
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.objectContaining({
          title: "Database error",
        }),
      })
    );
  });

  test("Test get all tickets", async () => {
    TrainTicket.find.mockResolvedValue([
      { trainNr: "1", code: "A123" },
      { trainNr: "2", code: "B234" },
    ]);

    await trains.getAllTrainTickets(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: [
        { trainNr: "1", code: "A123" },
        { trainNr: "2", code: "B234" },
      ],
    });
  });

  test("Test get specific train tickets - Valid", async () => {
    const mockTickets = [
      { _id: "12345", trainNr: "2", code: "A123" },
      { _id: "67890", trainNr: "1", code: "B456" },
    ];

    TrainTicket.find.mockResolvedValue(mockTickets);

    await trains.getSpecificTrainTickets(mockRes, "2", "");

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockTickets,
    });
  });

  test("Test get specific train tickets - Missing train number", async () => {
    await trains.getSpecificTrainTickets(mockRes, null, "");

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.objectContaining({
          title: "Attribute missing",
          detail: "Train number is required to fetch specific ticket",
        }),
      })
    );
  });

  test("Test edit specific ticket", async () => {
    const updatedData = { trainNr: "1", code: "TestCode221" };
    TrainTicket.findByIdAndUpdate.mockResolvedValue(updatedData);

    await trains.editSpecificTrainTickets(
      mockRes,
      "1",
      { code: "TestCode221" },
      ""
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ data: updatedData });
  });

  test("Test delete specific ticket", async () => {
    TrainTicket.findByIdAndDelete.mockResolvedValue(true);

    await trains.deleteSpecificTrainTicket(mockRes, "1", "");

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Ticket deleted successfully!",
    });
  });
});
