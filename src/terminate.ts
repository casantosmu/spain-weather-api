import { closeMongoDb } from "./db";
import { stopServer } from "./server";

const exitCodes = {
  ok: 0,
  error: 1,
};

export const terminateApp = (exitCode: keyof typeof exitCodes) => {
  stopServer().finally(() => {
    closeMongoDb().finally(() => {
      process.exitCode = exitCodes[exitCode];
    });
  });
};
