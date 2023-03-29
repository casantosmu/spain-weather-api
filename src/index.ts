import { type Request, type Response } from "express";
import express from "express";
import dotenv from "dotenv";
import docsRouter from "./docs/docsRouter";
import router from "./router";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use("/v1", router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
