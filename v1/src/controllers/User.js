const httpStatus = require("http-status");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");
const usersService = require("../services/UsersService");
const projectsService = require("../services/ProjectsService");

class UserController {
  create(req, res) {
    req.body.password = passwordToHash(req.body.password);

    usersService
      .create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  login(req, res) {
    req.body.password = passwordToHash(req.body.password);
    usersService
      .findOne(req.body)
      .then((user) => {
        if (!user) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "User not found!" });
        }

        user = {
          ...user._doc,
          tokens: {
            access_token: generateAccessToken(user),
            refresh_token: generateRefreshToken(user),
          },
        };
        delete user.password;
        res.status(httpStatus.OK).send(user);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }

  index(req, res) {
    usersService
      .list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }

  projectList(req, res) {
    projectsService
      .list({ user_id: req.user?._id })
      .then((projects) => {
        res.status(httpStatus.OK).send(projects);
      })
      .catch(() =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Projeleri getirirken beklenmedik bir hata oluştu",
        })
      );
  }

  resetPassword(req, res) {
    const new_password =
      uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
    usersService
      .updateWhere(
        { email: req.body.email },
        { password: passwordToHash(new_password) }
      )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ error: "Böyle bir kullanici bulunmamaktadir." });
        }
        eventEmitter.emit("send_email", {
          to: updatedUser.email,
          subject: "Şifre sifirlama",
          html: `Talebiniz üzerine sifreniz değiştirilmiştir. <br/> Giriş yaptiktan sona şifrenizi değiştirmeyi unutmayin! <br /> Yeni şifreniz: <b>${new_password}</b>`,
        });
        res.status(httpStatus.OK).send({
          message:
            "Şifre sifirlama işlemi için sisteme kayitli e-posta adresinize gereken bilgi gönderilmiştir..",
        });
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Şifre sifirlama esnasinda bir hata meydana geldi" })
      );
  }

  update(req, res) {
    usersService
      .update(req.user?._id, req.body)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Update isleminde bir hata meydana geldi" })
      );
  }

  changePassword(req, res) {
    //TODO: UI Geldikten sonra şifre karşılaştırmaları
    req.body.password = passwordToHash(req.body.password);
    usersService
      .update(req.user?._id, req.body)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Update isleminde bir hata meydana geldi" })
      );
  }

  deleteUser(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "There is no ID",
      });
    }

    usersService
      .delete(req.params.id)
      .then((deletedUser) => {
        if (!deletedUser) {
          return res.status(httpStatus.NOT_FOUND).send({
            message: "Böyle bir user bulunmamaktadir.",
          });
        }
        res.status(httpStatus.OK).send({
          message: "User silinmiştir..",
        });
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Silme sirasinda bir hata oluştu" })
      );
  }

  updateProfileImage(req, res) {
    // 1 -Resim kontrolü
    if (!req?.files?.profile_image) {
      return res.status(httpStatus.BAD_REQUEST).send({
        error: "Bu islemi yapmak icin gerekli veriye sahip degilsiniz..",
      });
    }
    // 2 -Upload işlemi
    // mv() -> move eder içinde ve verilen pathe yazar
    const extension = path.extname(req.files.profile_image.name);
    const fileName = `${req?.user._id}${extension}`;
    const folderPath = path.join(__dirname, "../", "/uploads/users", fileName);
    req.files.profile_image.mv(folderPath, function (err) {
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: err,
        });
      }
      // 3 -Db Save
      usersService
        .update(req.user._id, { profile_image: fileName })
        .then((updatedUser) => {
          // 4 -Response
          return res.status(httpStatus.OK).send(updatedUser);
        })
        .catch(() =>
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ error: "Image upload sirasinda bir hata meydana geldi!" })
        );
    });
  }
}

module.exports = new UserController();
