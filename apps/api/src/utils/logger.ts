import { createLogger, format, transports } from "winston";
import path from "path";

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: path.resolve("logs/error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.resolve("logs/combined.log"),
    }),
  ],

  exceptionHandlers: [
    new transports.File({
      filename: path.resolve("logs/exceptions.log"),
    }),
  ],

  rejectionHandlers: [
    new transports.File({
      filename: path.resolve("logs/rejections.log"),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    })
  );
}

export default logger;
