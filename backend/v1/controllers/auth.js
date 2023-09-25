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
};

module.exports = auth;
