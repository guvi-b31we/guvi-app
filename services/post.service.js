const helper = require("../helpers/post.helper");
const { validate, postSchema } = require("../shared/schema");

module.exports = {
  async getAll(_, res) {
    try {
      const posts = await helper.findAll();
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching posts" });
    }
  },

  async getById(req, res) {
    try {
      const post = await helper.findById(req.params.id);

      if (!post) return res.status(401).json({ message: "Post doesn't exist" });

      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching post" });
    }
  },

  async create(req, res) {
    try {
      // Request Body Validation
      const isError = await validate(postSchema, req.body);
      if (isError) return res.status(400).json({ message: isError });

      // Insert Into Posts Collection
      const { insertedId } = await helper.insert({
        ...req.body,
        userId: req.user._id,
      });

      const post = await helper.findById(insertedId);
      
      res.json({ message: "Post created successfully!", post });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error while creating post" });
    }
  },

  async update(req, res) {
    try {
      // Request Body Validation
      const isError = await validate(postSchema, req.body);
      if (isError) return res.status(400).json({ message: isError });

      // Post Exists Or Not
      let post = await helper.findById(req.params.id);

      if (!post) return res.status(401).json({ message: "Post doesn't exist" });

      if (post.userId != req.user._id)
        return res.status(401).json({
          message: "User is not authorized to perform this operation",
        });

      // Update Posts Collection
      const { value } = await helper.updateById(req.params.id, req.body);

      res.json({ message: "Post updated successfully!", post: value });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error while updating post" });
    }
  },

  async remove(req, res) {
    try {
      // Post Exists Or Not
      const post = await helper.findById(req.params.id);

      if (!post) return res.status(401).json({ message: "Post doesn't exist" });

      if (post.userId != req.user._id)
        return res.status(401).json({
          message: "User is not authorized to perform this operation",
        });

      // Delete From Posts Collection
      await helper.deleteById(req.params.id);

      res.json({ message: "Post deleted successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error while deleting post" });
    }
  },
};
