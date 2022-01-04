import type { RequestOptionsInit } from 'umi-request';
import {clearJWTExpiredLocalStorage, clearJWTLocalStorage, getJWTExpired, getJWTLocalStorage} from "./helper";
import { extend } from 'umi-request';
import {message} from "antd";

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const auth = getJWTLocalStorage();
  if (auth && !getJWTExpired()) {
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
      if (error === "unauthorized") {
        clearJWTExpiredLocalStorage()
        clearJWTLocalStorage()
        location.href = "/"
      }
      if (error === "request.nft.error.none") {
        message.error("Sorry, you're not a landowner yet. Go to the Opensea to buy a plot of land and become an owner now!")
      }
      return response
    }
    return data
  }
)


export default request;
