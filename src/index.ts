import mongoose from "mongoose";
import express from "express";
import router from "./router";
import pinoHttp from "pino-http";

const app = express();
const port = process.env["SERVER_PORT"] ?? 3000;

const httpLogger = pinoHttp();

app.use(httpLogger);
app.use("/v1", router);

(async () => {
  await mongoose.connect(process.env["MONGODB_URI"]!);
  console.log("Database connection successful");
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
})();
