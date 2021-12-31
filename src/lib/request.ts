import type { RequestOptionsInit } from 'umi-request';
import {getJWTExpired, getJWTLocalStorage} from "./helper";
import { extend } from 'umi-request';

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const auth = getJWTLocalStorage();
  console.log(auth && getJWTExpired())
  if (auth && getJWTExpired()) {
    return {
      url,
      options: { ...options, interceptors: true, headers: { Authorization: `${auth}` } },
    };
  }
  return { url, options };
};

const request = extend({
  // errorHandler, // default error handling
  credentials: 'same-origin', // Does the default request bring cookies
});

request.interceptors.request.use(authHeaderInterceptor)

request.interceptors.response.use(
  async (response, options) => {
    const origin = await response.clone().json()
    const {data, error} = origin
    if (error) {
      if (error === "error.common.not_login") {
        location.href = "/"
      }
      return
    }
    return data
  }
)


export default request;
