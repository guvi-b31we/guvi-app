const { ObjectId } = require("mongodb");

const db = require("../shared/mongo");

module.exports = {
  findAll() {
    return db.posts.find({ active: true }).toArray();
  },

  findById(_id) {
    return db.posts.findOne({ _id: ObjectId(_id), active: true });
  },

  insert(data) {
    return db.posts.insertOne({
      ...data,
      active: true,
      createdOn: new Date(),
    });
  },

  updateById(_id, data) {
    return db.posts.findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: { ...data, lastModifiedOn: new Date() } },
      { returnDocument: "after" }
    );
  },

  deleteById(_id) {
    return this.updateById(_id, { active: false });
  },
};
