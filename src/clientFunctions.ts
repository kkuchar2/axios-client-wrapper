import { AnyAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Dispatch } from "redux";

import { Dictionary, OnBeforeArgs, OnFailArgs, OnSuccessArgs } from "./clientTypes";
import Cookies from "universal-cookie";

export enum ErrorType {
  NetworkError,
  EmptyResponse,
  EmptyResponseData,
  Unauthorized,
  ServerError,
  Unknown,
}

export const _sendPostNoCookies = async (url: string, body: Dictionary<any>) => axios.post(url, body);

export const _sendPostWithCookiesAndCsrf = async (url: string, body: Dictionary<any>) => {
  return axios.post(url, body, { withCredentials: true, headers: _getAuthenticationHeaders() });
};

export const _sendPostFileNoCookies = async (
  url: string,
  file: File,
  onUploadProgress: (progressEvent: any) => void,
) => {
  const formData = _createFormDataFromFile(file, "img");
  return axios.post(url, formData, { onUploadProgress: onUploadProgress });
};

export const _sendPostFileWithCookiesAndCsrf = async (
  url: string,
  file: File,
  onUploadProgress: (progressEvent: any) => void,
) => {
  const formData = _createFormDataFromFile(file, "img");

  return axios.post(url, formData, {
    withCredentials: true,
    headers: _getAuthenticationHeaders(),
    onUploadProgress,
  });
};

export const _sendGetNoCookies = async (url: string, params: Dictionary<string>) => {
  return axios.get(composeUrl(url, params), {
    headers: _getNormalHeaders(),
  });
};

export const _sendGetWithCookiesAndCsrf = async (url: string, params: Dictionary<string>) => {
  return axios.get(composeUrl(url, params), { withCredentials: true, headers: _getAuthenticationHeaders() });
};

export const dispatchError = (
  dispatch: Dispatch,
  onFail: (params: OnFailArgs) => AnyAction,
  url: string,
  errorType: ErrorType,
  message: string,
) => {
  dispatch(
    onFail({
      path: url,
      data: [],
      errors: [
        {
          request: [{ type: errorType, message: message, url }],
        },
      ],
    }),
  );
};

export const dispatchOtherError = (
  dispatch: Dispatch,
  onFail: (params: OnFailArgs) => AnyAction,
  url: string,
  errorData: string,
) => dispatch(onFail({ path: url, data: [], errors: [errorData] }));

export const dispatchSuccess = (
  dispatch: Dispatch,
  onSuccess: (params: OnSuccessArgs) => AnyAction,
  url: string,
  data: string,
) => dispatch(onSuccess({ path: url, data: data }));

export const dispatchOnBefore = (
  dispatch: Dispatch,
  onBefore: (params: OnBeforeArgs) => AnyAction,
  url: string,
  data: any,
) => dispatch(onBefore({ path: url, data: data, errors: [] }));

export const _handleErrors = (e: any, url: string, onFail: (params: OnFailArgs) => AnyAction, dispatch: Dispatch) => {
  if (e.message === "Network Error") {
    dispatchError(dispatch, onFail, url, ErrorType.NetworkError, "Network Error");
    return;
  }

  if (!e.response) {
    dispatchError(dispatch, onFail, url, ErrorType.EmptyResponse, "The response is empty");
    return;
  }

  if (e.response.status === 401) {
    dispatchError(dispatch, onFail, url, ErrorType.Unauthorized, "Unauthorized");
  } else if (e.response.status === 500) {
    dispatchError(dispatch, onFail, url, ErrorType.ServerError, "Server error");
  } else {
    dispatchError(dispatch, onFail, url, ErrorType.Unknown, e.response);
  }
};

const _createFormDataFromFile = (file: File, propertyName: string) => {
  const formData = new FormData();
  formData.append(propertyName, file);
  return formData;
};

export const composeUrl = (url: string, params: Dictionary<string>) => {
  let parametrizedUrl = url;

  for (const [key, value] of Object.entries(params)) {
    parametrizedUrl += `?${key}=${value}`;
  }

  return parametrizedUrl;
};

const _getAuthenticationHeaders = () => {
  return {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "X-CSRFTOKEN": new Cookies().get("csrftoken"),
  };
};

const _getNormalHeaders = () => {
  return {
    Accept: "application/json",
  };
};
