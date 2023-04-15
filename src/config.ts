import { cleanEnv, num, str, testOnly, url } from "envalid";

const env = cleanEnv(process.env, {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SERVER_PORT: num({
    default: 8000,
    devDefault: testOnly(0),
    desc: "For test environments must be 0, which means that a dynamically available port will be assigned.",
  }),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  LOG_LEVEL: str({
    choices: ["silent", "debug", "info", "warn", "error", "fatal"],
    default: "info",
    devDefault: "debug",
    desc: "Specifies the level of detail of the log messages that are written to the log.",
  }),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MONGODB_URI: url(),
});

export const config = {
  nodeEnv: env.NODE_ENV,
  isProduction: env.isProduction,
  isTest: env.isTest,
  isDev: env.isDev,
  serverPort: env.SERVER_PORT,
  logLevel: env.LOG_LEVEL,
  mongodbUri: env.MONGODB_URI,
};
