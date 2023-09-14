// validate middlware
const validate = require("../middlewares/validate");
// validations
const schemas = require("../validations/Tasks");

const authenticate = require("../middlewares/authenticate");

const express = require("express");

const TaskController = require("../controllers/Task");

const router = express.Router();

router.route("/").get(authenticate, TaskController.index);

router
  .route("/")
  .post(
    authenticate,
    validate(schemas.createValidation),
    TaskController.create
  );

router.route("/:id").get(authenticate, TaskController.showTask);

router
  .route("/:id")
  .patch(
    authenticate,
    validate(schemas.updateValidation),
    TaskController.update
  );

router
  .route("/:id/add-sub-task")
  .post(
    authenticate,
    validate(schemas.createValidation),
    TaskController.addSubTask
  );

router
  .route("/:id/make-comment")
  .post(
    authenticate,
    validate(schemas.commentValidation),
    TaskController.makeComment
  );

router
  .route("/:id/:commentId")
  .delete(authenticate, TaskController.deleteComment);

router.route("/:id").delete(authenticate, TaskController.deleteTask);

module.exports = router;
