import { type Request, type Response, Router as expressRouter } from "express";
import swaggerUi from "swagger-ui-express";
import docsJson from "./docs.json";

const router = expressRouter();

router.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

router.get("/docs.json", (_req, res) => res.json(docsJson));
router.use("/docs", swaggerUi.serve, swaggerUi.setup(docsJson));

export default router;
