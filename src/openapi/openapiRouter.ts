import { Router as expressRouter } from "express";
import swaggerUi from "swagger-ui-express";
import openapiJson from "./openapi.json";

const openapiRouter = expressRouter();

const options = {
  swaggerOptions: {
    url: "/openapi.json",
  },
};

openapiRouter.get("/openapi.json", (req, res) => res.json(openapiJson));
openapiRouter.use(
  "/openapi",
  swaggerUi.serveFiles(undefined, options),
  swaggerUi.setup(undefined, options)
);

export default openapiRouter;
