import { closeMongoDb } from "./db";
import { stopServer } from "./server";

export const terminateApp = (exitCode: "ok" | "error" = "ok") => {
  stopServer(() => {
    closeMongoDb().finally(() => {
      process.exitCode = exitCode === "ok" ? 0 : 1;
    });
  });
};
