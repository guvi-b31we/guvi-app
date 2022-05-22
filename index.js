const { config } = require("dotenv");
const express = require("express");

const { authRoute, postRoute } = require("./routes");
const { maintenance, logging, validateToken } = require("./shared/middleware");
const { log, mongo } = require("./shared");

const app = express();
config();

(async () => {
  try {
    // DB Connection
    await mongo.connect();

    // Middlewares
    app.use(express.json());
    app.use(maintenance);
    app.use(logging);

    // Auth Route
    app.use("/auth", authRoute);

    // Auth Middleware
    app.use(validateToken);

    // Routes
    app.use("/posts", postRoute);

    app.listen(process.env.PORT, () => log(`Server listening at port - ${process.env.PORT}`));
  } catch (err) {
    log(`Error creating server - ${err.message}`);
    process.exit();
  }
})();
