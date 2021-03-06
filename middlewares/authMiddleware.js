const passport = require('passport');
require("dotenv").config();

// By default passport wants to use cookie based authentication for the user
// In our case, we are using tokens, so we set this behavior to false
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });
const jwt = require("jsonwebtoken");
const privateKey = process.env.SECRET_KEY;

module.exports = {
  requireAuth,
  requireSignIn,
  checkAuth: async (req, res, next) => {
    const token = req.get('authorization')
    if (!token) {
      return res.status(401).json({ error: "Access denied, token missing!" });
    } else {
      try {
        //if the incoming request has a valid token, we extract the payload from the token and attach it to the request object.
        const payload = jwt.verify(token, privateKey);
        
        req.user = payload.user;
        next()
      } catch (error) {
        // token can be expired or invalid. Send appropriate errors in each case:
        if (error.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ error: "Expired" });
        } else if (error.name === "JsonWebTokenError") {
          return res
            .status(401)
            .json({ error: "Invalid" });
        } else {
          //catch other unprecedented errors
          console.error(error);
          return res.status(400).json({ error });
        }
      }
    }
  }
};