const { insert, modify, list, remove } = require("../services/Projects");
const httpStatus = require("http-status");

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const create = (req, res) => {
  req.body.user_id = req.user;
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const update = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "There is no ID",
    });
  }

  modify(req.body, req.params.id)
    .then((updatedProject) => {
      res.status(httpStatus.OK).send(updatedProject);
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Kayit sirasinda bir hata oluştu" })
    );
};

const deleteProject = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "There is no ID",
    });
  }

  remove(req.params.id)
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
};

module.exports = {
  index,
  create,
  update,
  deleteProject,
};
