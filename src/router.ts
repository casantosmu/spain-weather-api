import { Router as expressRouter } from "express";
import swaggerUi from "swagger-ui-express";
import docsJson from "./docs.json";
import { validateMiddleware } from "./validator";
import {
  getLocationsQueryValidator,
  getReverseLocationQueryValidator,
} from "./modules/location/locationValidator";
import {
  getLocationsController,
  getReverseLocationController,
} from "./modules/location/locationController";
import { asyncWrapper } from "./middlewares";

const router = expressRouter();

router.get(
  "/locations",
  validateMiddleware(getLocationsQueryValidator, "query"),
  asyncWrapper(getLocationsController)
);
router.get(
  "/locations/reverse",
  validateMiddleware(getReverseLocationQueryValidator, "query"),
  asyncWrapper(getReverseLocationController)
);

router.get("/docs.json", (_req, res) => res.json(docsJson));
router.use("/docs", swaggerUi.serve, swaggerUi.setup(docsJson));

export default router;
