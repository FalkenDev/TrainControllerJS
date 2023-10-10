const auth = require("../controllers/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller Tests", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
    bcrypt.hash.mockResolvedValue("hashedPassword");
  });

  test("Test register user - Valid", async () => {
    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
    }));

    await auth.registerUser(mockRes, {
      email: "test@example.com",
      password: "password123",
    });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "User registered successfully",
    });
  });

  test("Test login user - Valid", async () => {
    const mockUser = {
      password: await bcrypt.hash("password123", 10),
      _id: "someUserId",
    };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("someToken");

    await auth.loginUser(mockRes, {
      email: "test@example.com",
      password: "password123",
    });
    expect(mockRes.send).toHaveBeenCalledWith({ token: "someToken" });
  });

  test("Test login user - Invalid email or password", async () => {
    User.findOne.mockResolvedValue(null);

    await auth.loginUser(mockRes, {
      email: "test@example.com",
      password: "wrongpassword",
    });
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  test("Test get user data - Valid token", async () => {
    const mockReq = {
      headers: {
        authorization: "Bearer someToken",
      },
    };
    const mockDecoded = { userId: "someUserId" };
    const mockUser = {
      _id: "someUserId",
      email: "test@example.com",
      password: "hashedPassword",
    };

    jwt.verify.mockImplementation((token, secret, callback) =>
      callback(null, mockDecoded),
    );

    User.findById.mockResolvedValue(mockUser);

    await auth.getUserData(mockRes, mockReq);

    expect(mockRes.send).toHaveBeenCalledWith({
      _id: "someUserId",
      email: "test@example.com",
    });
  });
});
