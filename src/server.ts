import { type Server } from "http";
import app from "./app";
import logger from "./logger";
import { config } from "./config";

let server: Server | undefined;

export const startServer = async () =>
  new Promise<void>((resolve, reject) => {
    server = app.listen(config.serverPort, () => {
      logger.info(`Server is running at http://localhost:${config.serverPort}`);
      resolve();
    });

    server.once("error", (error) => {
      reject(error);
    });
  });

export const stopServer = async () =>
  new Promise<void>((resolve) => {
    if (server) {
      server.close(() => {
        logger.info("HTTP server closed");
        resolve();
      });
      return;
    }

    resolve();
  });
