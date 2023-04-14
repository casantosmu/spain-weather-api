import { Router as expressRouter } from "express";
import swaggerUi from "swagger-ui-express";
import docsJson from "./docs.json";

const docsRouter = expressRouter();

docsRouter.get("/docs.json", (_req, res) => res.json(docsJson));
docsRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(docsJson));

export default docsRouter;
