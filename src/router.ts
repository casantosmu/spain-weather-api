import { type Request, type Response, Router as expressRouter } from "express";
import docsRouter from "./docs/docsRouter";

const router = expressRouter();

router.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

router.use(docsRouter);

export default router;
