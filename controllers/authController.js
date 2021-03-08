const db = require("./../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const tokenForUser = function (user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, process.env.SECRET_KEY, { expiresIn: 600 });
};


module.exports = {
  signUp: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(422)
        .json({ error: "You must provide an email and password" });
    }
    try {
      // Check if theres existing user
      const existingUser = await db.User.findOne({ email });
      // if user exist, throw error
      if (existingUser) {
        return res.status(422).json({ error: "Email is in use" });
      }
      // else save the user as a new user in the dabatase
      const user = new db.User({ email, password });
      await user.save();
      res.json({ token: tokenForUser(user) });
    } catch (error) {
      console.log(error);
      
      res.status(404).json({ error: error });
    }
  },
  signIn: (req, res) => {
    res.send({ token: tokenForUser(req.user) });
  },
};
