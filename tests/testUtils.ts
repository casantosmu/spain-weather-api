import axios from "axios";
import app from "../src/app";
import { terminateApp } from "../src/terminate";
import { connectMongoDb, dropMongoDb } from "../src/db";
import { startServer } from "../src/server";

export const beforeAllIntegrationTests = async () => {
  await connectMongoDb();
  const { port } = await startServer(app);
  const httpClient = axios.create({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    baseURL: `http://localhost:${port}/api/v1`,
  });

  httpClient.interceptors.response.use(
    (response) => response,
    // Prevent http client to throw Error
    async (error) => Promise.resolve(error.response)
  );

  return { httpClient };
};

export const afterAllIntegrationTests = async () => {
  if (Math.random() < 0.2) {
    await dropMongoDb();
  }

  terminateApp("ok");
};
