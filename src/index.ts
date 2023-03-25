import { type Request, type Response } from "express";
import express from "express";
import dotenv from "dotenv";
import openapiRouter from "./openapi/openapiRouter";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
app.use(openapiRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
