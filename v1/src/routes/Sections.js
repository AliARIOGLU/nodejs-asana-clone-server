// validate middlware
const validate = require("../middlewares/validate");
// validations
const schemas = require("../validations/Sections");

const authenticate = require("../middlewares/authenticate");

const express = require("express");

const {
  index,
  create,
  update,
  deleteSection,
} = require("../controllers/Sections");

const router = express.Router();

router.route("/:projectId").get(authenticate, index);

router
  .route("/")
  .post(authenticate, validate(schemas.createValidation), create);

router
  .route("/:id")
  .patch(authenticate, validate(schemas.updateValidation), update);

router.route("/:id").delete(authenticate, deleteSection);

module.exports = router;
