import { type Request, type Response, Router as expressRouter } from "express";
import swaggerUi from "swagger-ui-express";
import docsRouter from "./docs/docsRouter";

const router = expressRouter();

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

router.use(docsRouter);

export default router;
