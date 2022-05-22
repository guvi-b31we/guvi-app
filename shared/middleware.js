const jwt = require("jsonwebtoken");

const log = require("./log");

module.exports = {
  validateToken(req, res, next) {
    if (req.headers && req.headers.authorization) {
      const [tokenType, token] = req.headers.authorization.split(" ");
      if (tokenType === "Bearer" && token) {
        try {
          req.user = jwt.verify(token, process.env.JWT_SECRET);
          next();
        } catch (err) {
          log(`Token Error - ${err.message}`);
          res.status(403).json({ message: "User is not authorized" });
        }
      } else {
        res.status(403).json({ message: "User is not authorized" });
      }
    } else {
      res.status(403).json({ message: "User is not authorized" });
    }
  },

  logging(req, _, next) {
    log(`${req.url} ${req.method}`);
    next();
  },

  maintenance(_, res, next) {
    process.env.IS_MAINTENANCE === "true" ? res.send("Site is under maintenance") : next();
  },
};
