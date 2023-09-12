// validate middlware
const validate = require("../middlewares/validate");
// validations
const schemas = require("../validations/Tasks");

const authenticate = require("../middlewares/authenticate");

const express = require("express");

const {
  create,
  update,
  deleteTask,
  makeComment,
  deleteComment,
  addSubTask,
  showTask,
} = require("../controllers/Tasks");

const router = express.Router();

router
  .route("/")
  .post(authenticate, validate(schemas.createValidation), create);

router.route("/:id").get(authenticate, showTask);

router
  .route("/:id")
  .patch(authenticate, validate(schemas.updateValidation), update);

router
  .route("/:id/add-sub-task")
  .post(authenticate, validate(schemas.createValidation), addSubTask);

router
  .route("/:id/make-comment")
  .post(authenticate, validate(schemas.commentValidation), makeComment);

router.route("/:id/:commentId").delete(authenticate, deleteComment);

router.route("/:id").delete(authenticate, deleteTask);

module.exports = router;
