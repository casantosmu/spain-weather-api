import { Router as expressRouter } from "express";
import swaggerUi from "swagger-ui-express";
import docsJson from "./docs.json";

const docsRouter = expressRouter();

const options = {
  swaggerOptions: {
    url: "/v1/docs.json",
  },
};

docsRouter.get("/docs.json", (_req, res) => res.json(docsJson));
docsRouter.use(
  "/docs",
  swaggerUi.serveFiles(undefined, options),
  swaggerUi.setup(undefined, options)
);

export default docsRouter;