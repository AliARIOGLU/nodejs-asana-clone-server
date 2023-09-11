const httpStatus = require("http-status");

const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body);
  if (error) {
    //bu formdan: error.details = [{message ""}, {message:""}, {message:""}..] şeklinde
    const errorMessage = error.details
      ?.map((detail) => detail.message)
      .join(", ");
    //bu forma geçti : "aaa, bbb, ccc" gibi
    res.status(httpStatus.BAD_REQUEST).json({ error: errorMessage });
    return;
  }
  // req ile buradaki valueyi next() edilen yere göndermek için assign ile bind ediyoruz.
  Object.assign(req, value);
  return next();
};

module.exports = validate;
