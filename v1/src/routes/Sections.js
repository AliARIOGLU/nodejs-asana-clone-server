//  middlewares
const validate = require("../middlewares/validate");
const idChecker = require("../middlewares/idChecker");
// validations
const schemas = require("../validations/Sections");

const authenticate = require("../middlewares/authenticate");

const express = require("express");

const SectionController = require("../controllers/Section");

const router = express.Router();

router
  .route("/:projectId")
  .get(idChecker("projectId"), authenticate, SectionController.index);

router
  .route("/")
  .post(
    authenticate,
    validate(schemas.createValidation),
    SectionController.create
  );

router
  .route("/:id")
  .patch(
    idChecker(),
    authenticate,
    validate(schemas.updateValidation),
    SectionController.update
  );

router
  .route("/:id")
  .delete(idChecker(), authenticate, SectionController.deleteSection);

module.exports = router;
