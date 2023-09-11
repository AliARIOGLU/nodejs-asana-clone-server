const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "projects-service" },
  transports: [
    new winston.transports.File({
      filename: "v1/src/logs/projects/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "v1/src/logs/projects/info.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "v1/src/logs/projects/combined.log",
    }),

    //   new winston.transport.Console()  // -> her bir aksiyonu console a yazmak istersen
  ],
});

module.exports = logger;
