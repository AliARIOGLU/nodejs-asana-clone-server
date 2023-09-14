const express = require("express");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const config = require("./config");
const loaders = require("./loaders");
const events = require("./scripts/events");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const {
  ProjectRoutes,
  UserRoutes,
  SectionRoutes,
  TaskRoutes,
} = require("./routes");

config();
loaders();
events();

const PORT = process.env.APP_PORT || 3000;

const app = express();
// dışarıya uploads altındakileri sunmaya yarıyor /uploads istek atıldığında dosyaları verir.
app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")));
app.use(express.json());
app.use(helmet());
app.use(fileUpload());

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda ayakta...`);
  app.use("/projects", ProjectRoutes);
  app.use("/users", UserRoutes);
  app.use("/sections", SectionRoutes);
  app.use("/tasks", TaskRoutes);

  app.use((req, res, next) => {
    const error = new Error("Aradiginiz sayfa bulunmamaktadir..");
    error.status = 404;
    next(error);
  });

  //! Error Handler
  app.use(errorHandler);
});
