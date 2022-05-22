const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../shared/mongo");
const { signInSchema, signUpSchema, validate } = require("../shared/schema");

module.exports = {
  async signIn(req, res) {
    try {
      // Request Body Validation
      const isError = await validate(signInSchema, req.body);
      if (isError) return res.status(400).json({ message: isError });

      // Check User Exists Or Not
      const user = await db.users.findOne({
        email: req.body.email,
      });

      if (!user)
        return res
          .status(401)
          .json({ message: "User doesn't exist" });

      if (!user.active)
        return res.status(401).json({ message: "User is inactive" });

      // Check Password
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (isValid) {
        delete user.password;
        const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.json({ message: "User signed in successfully", authToken });
      } else {
        res.status(401).json({ message: "Email and password doesn't match" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error while signing in user" });
    }
  },

  async signUp(req, res) {
    try {
      // Request Body Validation
      const isError = await validate(signUpSchema, req.body);
      if (isError) return res.status(400).json({ message: isError });

      // Check User Exists Or Not
      let user = await db.users.findOne({ email: req.body.email });
      if (user) return res.status(400).json({ message: "User already exists" });

      // Encrypt The Password
      req.body.password = await bcrypt.hash(
        req.body.password,
        await bcrypt.genSalt()
      );

      // Delete Confirm Password Before Insertion
      delete req.body.cPassword;

      // Insert Into Users Collection
      user = await db.users.insertOne({ ...req.body, active: true, createdOn: new Date() });
      res.json({ message: "User signed up successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error while signing up user" });
    }
  },
};
