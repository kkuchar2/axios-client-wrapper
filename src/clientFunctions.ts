import { AnyAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Dispatch } from "redux";

import { Dictionary, OnFailArgs } from "./clientTypes";
import Cookies from "universal-cookie";

export enum RequestErrorType {
  NetworkError,
  EmptyResponse,
  Unauthorized,
  ServerError,
  Unknown,
}

export const _sendPostNoCookies = async (url: string, body: Dictionary<any>) =>
  axios.post(url, body);

export const _sendPostWithCookiesAndCsrf = async (url: string, body: Dictionary<any>) => {
  return axios.post(url, body, {
    withCredentials: true,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRFTOKEN": new Cookies().get("csrftoken"),
    },
  });
};

export const _sendPostFileNoCookies = async (url: string, file: File) => {
  const data = new FormData();
  data.append("title", "ProfileImage");
  data.append("text", "random_text");
  data.append("img", file);

  return axios.post(url, data, {
    onUploadProgress: () => {},
  });
};

export const _sendPostFileWithCookiesAndCsrf = async (
  url: string,
  file: File,
  onUploadProgress: (progressEvent: any) => void,
) => {
  const data = new FormData();
  data.append("title", "ProfileImage");
  data.append("text", "random_text");
  data.append("img", file);

  return axios.post(url, data, {
    withCredentials: true,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRFTOKEN": new Cookies().get("csrftoken"),
    },
    onUploadProgress,
  });
};

export const _sendGetNoCookies = async (url: string, params: Dictionary<string>) => {
  return axios.get(composeUrl(url, params), {
    headers: { Accept: "application/json" },
  });
};

export const _sendGetWithCookiesAndCsrf = async (url: string, params: Dictionary<string>) => {
  return axios.get(composeUrl(url, params), {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRFTOKEN": new Cookies().get("csrftoken"),
    },
  });
};

export const dispatchError = (
  dispatch: Dispatch,
  onFail: (params: OnFailArgs) => AnyAction,
  url: string,
  errorType: RequestErrorType,
  message: string,
) => {
  dispatch(
    onFail({
      errors: {
        request: [{ type: errorType, message: message, url }],
      },
      url,
    }),
  );
};

export const _handleErrors = (
  e: any,
  url: string,
  onFail: (params: OnFailArgs) => AnyAction,
  dispatch: Dispatch,
) => {
  if (e.message === "Network Error") {
    dispatchError(dispatch, onFail, url, RequestErrorType.NetworkError, "Network Error");
    return;
  }

  if (!e.response) {
    dispatchError(dispatch, onFail, url, RequestErrorType.EmptyResponse, "The response is empty");
    return;
  }

  if (e.response.status === 401) {
    dispatchError(dispatch, onFail, url, RequestErrorType.Unauthorized, "Unauthorized");
  } else if (e.response.status === 500) {
    dispatchError(dispatch, onFail, url, RequestErrorType.ServerError, "Server error");
  } else {
    dispatchError(dispatch, onFail, url, RequestErrorType.Unknown, e.response);
  }
};

export const composeUrl = (url: string, params: Dictionary<string>) => {
  let parametrizedUrl = url;

  for (const [key, value] of Object.entries(params)) {
    parametrizedUrl += `?${key}=${value}`;
  }

  return parametrizedUrl;
};
