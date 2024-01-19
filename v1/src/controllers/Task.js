const httpStatus = require("http-status");
const tasksService = require("../services/TasksService");

class TaskController {
  index(req, res) {
    if (!req?.params?.projectId) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "Proje ID bulunamadi!" });
    }
    tasksService
      .list({ project_id: req.params.projectId })
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }

  create(req, res) {
    req.body.user_id = req.user;
    tasksService
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

    tasksService
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

  deleteTask(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "There is no ID",
      });
    }

    tasksService
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

  makeComment(req, res) {
    tasksService
      .findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "Böyle bir kayit bulunmamaktadir." });
        }
        const comment = {
          ...req.body,
          commented_at: new Date(),
          user_id: req.user,
        };
        mainTask.comments.push(comment);
        mainTask
          .save()
          .then((updatedDoc) => {
            return res.status(httpStatus.OK).send(updatedDoc);
          })
          .catch(() =>
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR)
              .send({ error: "Kayit sirasinda bir hata oluştu" })
          );
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Kayit sirasinda bir hata oluştu" })
      );
  }

  deleteComment(req, res) {
    tasksService
      .findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "Böyle bir kayit bulunmamaktadir." });
        }
        mainTask.comments = mainTask.comments.filter(
          (c) => c._id?.toString() !== req.params.commentId
        );
        mainTask
          .save()
          .then((updatedDoc) => {
            return res.status(httpStatus.OK).send(updatedDoc);
          })
          .catch(() =>
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR)
              .send({ error: "Kayit sirasinda bir hata oluştu" })
          );
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Kayit sirasinda bir hata oluştu" })
      );
  }

  addSubTask(req, res) {
    //! Main Task çekilir.
    if (!req.params.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "ID bilgisi gerekli" });
    }
    tasksService
      .findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "Böyle bir kayit bulunmamaktadir." });
        }
        //! SubTask create edilir(task)
        tasksService
          .create({ ...req.body, user_id: req.user })
          .then((subTask) => {
            //! SubTask'in referansı MainTask üzerinde gösterilir ve update edilir
            mainTask.sub_tasks.push(subTask);
            mainTask
              .save()
              .then((updatedDoc) => {
                //! Kullanıcıya yeni döküman gönderilir.
                return res.status(httpStatus.OK).send(updatedDoc);
              })
              .catch(() =>
                res
                  .status(httpStatus.INTERNAL_SERVER_ERROR)
                  .send({ error: "Kayit sirasinda bir hata oluştu" })
              );
          })
          .catch((e) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
          });
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Kayit sirasinda bir hata oluştu" })
      );
  }

  showTask(req, res) {
    if (!req.params.id)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "ID bilgisi gerekli" });
    tasksService
      .findOne({ _id: req.params.id }, true)
      .then((task) => {
        if (!task) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "Böyle bir kayit bulunmamaktadir." });
        }
        res.status(httpStatus.OK).send(task);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }
}

module.exports = new TaskController();
