const Joi = require("joi");

module.exports = {
  async validate(schema, data) {
    try {
      await schema.validateAsync(data);
      return false;
    } catch ({ details: [error] }) {
      return error.message;
    }
  },

  signInSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  }),

  signUpSchema: Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().length(10),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    cPassword: Joi.ref("password"),
  }),

  postSchema: Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
  }),
};
