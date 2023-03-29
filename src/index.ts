import express from "express";
import router from "./router";

const app = express();
const port = process.env.PORT ?? 3000;

app.use("/v1", router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
