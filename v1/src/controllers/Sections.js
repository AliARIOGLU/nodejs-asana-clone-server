const { insert, modify, list, remove } = require("../services/Sections");
const httpStatus = require("http-status");

const index = (req, res) => {
  if (!req?.params?.projectId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: "Proje ID bulunamadi!" });
  }
  list({ project_id: req.params.projectId })
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
    .then((updatedDoc) => {
      res.status(httpStatus.OK).send(updatedDoc);
    })
    .catch(() =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Kayit sirasinda bir hata oluştu" })
    );
};

const deleteSection = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "There is no ID",
    });
  }

  remove(req.params.id)
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
};

module.exports = {
  index,
  create,
  update,
  deleteSection,
};
