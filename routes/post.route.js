const route = require("express").Router();

const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../services/post.service");

route.get("/", getAll);
route.get("/:id", getById);
route.post("/", create);
route.put("/:id", update);
route.delete("/:id", remove);

module.exports = route;
