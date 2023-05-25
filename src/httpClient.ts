import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import logger from "./logger";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig<unknown>) => {
    const requestInfo = `${request.method!.toUpperCase()} ${request.url!}`;
    logger.debug(`HTTP client request: ${requestInfo}`);
    return request;
  }
);

axiosInstance.interceptors.response.use((response: AxiosResponse<unknown>) => {
  const responseInfo = `Status: ${response.status} - URL: ${response.config
    .url!}`;
  logger.debug(`HTTP client response: ${responseInfo}`);
  return response;
});

const httpClient = {
  get: async <T = unknown>(url: string) => axiosInstance.get<T>(url),
};

export default httpClient;
