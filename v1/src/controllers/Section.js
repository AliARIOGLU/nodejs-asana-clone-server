const httpStatus = require("http-status");
const sectionsService = require("../services/SectionsService");

class SectionController {
  index(req, res) {
    if (!req?.params?.projectId) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "Proje ID bulunamadi!" });
    }
    sectionsService
      .list({ project_id: req.params.projectId })
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }

  create(req, res) {
    req.body.user_id = req.user;
    sectionsService
      .create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  update(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "There is no ID",
      });
    }

    sectionsService
      .update(req.params.id, req.body)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Kayit sirasinda bir hata oluştu" })
      );
  }

  deleteSection(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "There is no ID",
      });
    }

    sectionsService
      .delete(req.params.id)
      .then((deletedSection) => {
        if (!deletedSection) {
          return res.status(httpStatus.NOT_FOUND).send({
            message: "Böyle bir kayit bulunmamaktadir.",
          });
        }
        res.status(httpStatus.OK).send({
          message: "Section silinmiştir..",
        });
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Silme sirasinda bir hata oluştu" })
      );
  }
}

module.exports = new SectionController();
