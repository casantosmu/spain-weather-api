import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import logger from "./logger";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig<unknown>) => {
    const requestMetadata = {
      method: request.method?.toUpperCase(),
      url: request.url,
      headers: request.headers,
      data: request.data,
    };
    logger.debug("Http client request", requestMetadata);
    return request;
  }
);

axiosInstance.interceptors.response.use((response: AxiosResponse<unknown>) => {
  const responseMetadata = {
    url: response.config.url,
    status: response.status,
    headers: response.headers,
    data: response.data,
  };
  logger.debug("Http client response", responseMetadata);
  return response;
});

const httpClient = {
  get: async <T = unknown>(url: string) => axiosInstance.get<T>(url),
};

export default httpClient;
