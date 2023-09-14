// middlewares
const validate = require("../middlewares/validate");
const idChecker = require("../middlewares/idChecker");
// validations
const schemas = require("../validations/Users");
// authenticate middleware
const authenticate = require("../middlewares/authenticate");

const express = require("express");
const UserController = require("../controllers/User");

const router = express.Router();

router.get("/", UserController.index);
router
  .route("/")
  .post(validate(schemas.createValidation), UserController.create);
// alttaki update icin ayrıyeten /:id ye gerek yok authenticatede buna ulaşabiliyorum zaten
router
  .route("/")
  .patch(
    authenticate,
    validate(schemas.updateValidation),
    UserController.update
  );
router
  .route("/login")
  .post(validate(schemas.loginValidation), UserController.login);
router.route("/projects").get(authenticate, UserController.projectList);
router
  .route("/reset-password")
  .post(
    validate(schemas.resetPasswordValidation),
    UserController.resetPassword
  );

router
  .route("/change-password")
  .post(
    authenticate,
    validate(schemas.changePasswordValidation),
    UserController.changePassword
  );

router
  .route("/update-profile-image")
  .post(authenticate, UserController.updateProfileImage);

router
  .route("/:id")
  .delete(idChecker(), authenticate, UserController.deleteUser);

module.exports = router;
