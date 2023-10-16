const fetch = require("node-fetch");
const sanitize = require("mongo-sanitize");
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
};

module.exports = auth;
