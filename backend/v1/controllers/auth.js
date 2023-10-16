const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = {
  registerUser: async function (res, body) {
    try {
      const user = new User(body);
      await user.save();
      res.status(201).send({ message: "User registered successfully" });
    } catch (error) {
      res.status(400).send(error);
    }
  },

  registerUserGraphQL: async function (body) {
    try {
      const user = new User(body);
      await user.save();
      return { message: "User registered successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  loginUser: async function (res, body) {
    try {
      const user = await User.findOne({ email: body.email });
      if (!user)
        return res.status(400).send({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(body.password, user.password);
      if (!isMatch)
        return res.status(400).send({ message: "Invalid email or password" });

      const token = jwt.sign({ userId: user._id }, "secret_word", {
        expiresIn: "1h",
      });
      res.send({ token });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  loginUserGraphQL: async function (body) {
    try {
      const user = await User.findOne({ email: body.email });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(body.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      const token = jwt.sign({ userId: user._id }, "secret_word", {
        expiresIn: "1h",
      });

      return { token };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getUserData: async function (res, req) {
    try {
      const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];

      if (!token) return res.status(401).send({ message: "No token provided" });

      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, "secret_word", (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });

      const userId = decoded.userId;

      const user = await User.findById(userId).catch((e) => {
        return null;
      });

      if (!user) return res.status(404).send({ message: "User not found" });

      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  getUserDataGraphQL: async function (context) {
    try {
      const token =
        context.headers.authorization &&
        context.headers.authorization.split(" ")[1];
      if (!token) throw new Error("No token provided");

      let decoded;
      try {
        decoded = jwt.verify(token, "secret_word");
      } catch (err) {
        throw new Error("Failed to authenticate token");
      }

      const userId = decoded.userId;
      const user = await User.findById(userId).select("-password");
      if (!user) throw new Error("User not found");

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  checkAuthToken: async function (context = {}) {
    console.log("auth");
    const token =
      context.headers &&
      context.headers.authorization &&
      context.headers.authorization.split(" ")[1];
    if (!token) return false;

    try {
      console.log(jwt.verify(token, "secret_word"));
      return jwt.verify(token, "secret_word");
    } catch (err) {
      return false;
    }
  },
};

module.exports = auth;
