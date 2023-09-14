// middlewares
const validate = require("../middlewares/validate");
const idChecker = require("../middlewares/idChecker");
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

router.route("/:id").get(idChecker(), authenticate, TaskController.showTask);

router
  .route("/:id")
  .patch(
    idChecker(),
    authenticate,
    validate(schemas.updateValidation),
    TaskController.update
  );

router
  .route("/:id/add-sub-task")
  .post(
    idChecker(),
    authenticate,
    validate(schemas.createValidation),
    TaskController.addSubTask
  );

router
  .route("/:id/make-comment")
  .post(
    idChecker(),
    authenticate,
    validate(schemas.commentValidation),
    TaskController.makeComment
  );

router
  .route("/:id/:commentId")
  .delete(idChecker(), authenticate, TaskController.deleteComment);

router
  .route("/:id")
  .delete(idChecker(), authenticate, TaskController.deleteTask);

module.exports = router;
