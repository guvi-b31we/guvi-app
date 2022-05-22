const { MongoClient } = require("mongodb");

const log = require("./log");

module.exports = {
  db: null, // DB Connection String

  posts: null, // Posts Collection
  users: null, // Users Collection

  async connect() {
    try {
      // Connecting to Mongo
      const client = new MongoClient(process.env.MONGO_URL);
      await client.connect();
      log("Mongo connected successfully");

      // Selecting the DB
      this.db = await client.db(process.env.MONGO_NAME);
      log(`Mongo database selected - ${process.env.MONGO_NAME}`);

      this.posts = await this.db.collection("posts");
      this.users = await this.db.collection("users");
      log("Mongo collections initialized");
    } catch (err) {
      throw new Error(err);
    }
  },
};
