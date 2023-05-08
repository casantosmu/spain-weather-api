import express from "express";
import { httpLogger } from "./logger";
import router from "./router";
import { generalErrorMiddleware, notFoundMiddleware } from "./middlewares";

const app = express();

app.use(httpLogger);
app.disable("x-powered-by");

app.use("/api/v1", router);

app.use(notFoundMiddleware);
app.use(generalErrorMiddleware);

export default app;
