const httpStatus = require("http-status");
const projectsService = require("../services/ProjectsService");

class Project {
  index(req, res) {
    projectsService
      .list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }

  create(req, res) {
    req.body.user_id = req.user;
    projectsService
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

    projectsService
      .update(req.params.id, req.body)
      .then((updatedProject) => {
        res.status(httpStatus.OK).send(updatedProject);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Kayit sirasinda bir hata oluştu" })
      );
  }

  deleteProject(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "There is no ID",
      });
    }

    projectsService
      .delete(req.params.id)
      .then((deletedProject) => {
        if (!deletedProject) {
          return res.status(httpStatus.NOT_FOUND).send({
            message: "Böyle bir kayit bulunmamaktadir.",
          });
        }
        res.status(httpStatus.OK).send({
          message: "Proje silinmiştir..",
        });
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Silme sirasinda bir hata oluştu" })
      );
  }
}

module.exports = new Project();
