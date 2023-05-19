import { Router as expressRouter } from "express";
import swaggerUi from "swagger-ui-express";
import docsJson from "./docs.json";
import { validateMiddleware } from "./validator";
import { getLocationsQueryValidator } from "./modules/location/locationValidator";
import { getLocationsController } from "./modules/location/locationController";

const router = expressRouter();

router.get(
  "/locations",
  validateMiddleware(getLocationsQueryValidator, "query"),
  getLocationsController
);

router.get("/docs.json", (_req, res) => res.json(docsJson));
router.use("/docs", swaggerUi.serve, swaggerUi.setup(docsJson));

export default router;
