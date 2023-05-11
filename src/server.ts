import { type Server } from "http";
import logger from "./logger";
import { config } from "./config";
import { type Express } from "express";
import { type AddressInfo } from "net";

let server: Server | undefined;

export const startServer = async (app: Express) =>
  new Promise<AddressInfo>((resolve, reject) => {
    server = app.listen(config.serverPort, () => {
      const info = server?.address() as AddressInfo;
      logger.info(`Server is running at http://localhost:${info.port}`);
      resolve(info);
    });

    server.once("error", (error) => {
      logger.error("Error starting server");
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
