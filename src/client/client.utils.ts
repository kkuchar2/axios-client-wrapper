import {AnyAction} from "@reduxjs/toolkit";
import axios, {AxiosRequestHeaders, AxiosResponse} from "axios";
import {Dispatch} from "redux";
import {RequestStatus, ResponseArgs} from "./client.types";

export enum ErrorType {
  NetworkError,
  EmptyResponse,
  EmptyResponseData,
  Unauthorized,
  ServerError,
  Unknown,
}

export const sendGet = async (
    url: string,
    requestData: object,
    withCredentials: boolean,
    headers: AxiosRequestHeaders,
) => {
  return axios.get(composeUrl(url, requestData), {
    withCredentials: withCredentials,
    headers: headers,
  });
};


export const sendPost = async (
    url: string,
    requestData: object,
    withCredentials: boolean,
    headers: AxiosRequestHeaders,
) => {
  return axios.post(url, {
    data: requestData,
    withCredentials: withCredentials,
    headers: headers,
  });
};

export const sendPostFile = async (
    url: string,
    file: File,
    filePropertyName: string,
    withCredentials: boolean,
    headers: AxiosRequestHeaders,
    onUploadProgress: (progressEvent: any) => void,
) => {
  return axios.post(url, createFormDataFromFile(file, filePropertyName), {
    withCredentials: withCredentials,
    headers: headers,
    onUploadProgress: onUploadProgress,
  });
};

export const sendDelete = async (
    url: string,
    requestData: object,
    withCredentials: boolean,
    headers: AxiosRequestHeaders,
) => {
  return axios.delete(url, {
    data: requestData,
    withCredentials: withCredentials,
    headers: headers,
  });
};

export const sendPut = async (
    url: string,
    requestData: object,
    withCredentials: boolean,
    headers: AxiosRequestHeaders,
) => {
  return axios.put(url, requestData, {
    withCredentials: withCredentials,
    headers: headers,
  });
};

export const dispatchError = (
    dispatch: Dispatch,
    reducer: (params: ResponseArgs) => AnyAction,
    url: string,
    requestData: object,
    responseData: AxiosResponse,
    errorType: ErrorType,
    message: string,
) => {
  dispatch(
      reducer({
        status: RequestStatus.Failure,
        path: url,
        requestData: requestData,
        responseData: {
          errorData: responseData.data,
          status: responseData.status,
          statusText: responseData.statusText,
          headers: responseData.headers
        },
        errors: [
          {
            request: [{type: errorType, message: message, url}],
          },
        ]
      }),
  );
};

export const dispatchOtherError = (
    dispatch: Dispatch,
    reducer: (params: ResponseArgs) => AnyAction,
    path: string,
    requestData: object,
    responseData: AxiosResponse,
    errors: object[],
) => dispatch(reducer({
  path: path,
  status: RequestStatus.Failure,
  requestData: requestData,
  responseData: responseData,
  errors: errors
}));

export const dispatchSuccess = (
    dispatch: Dispatch,
    reducer: (params: ResponseArgs) => AnyAction,
    path: string,
    requestData: object,
    responseData: AxiosResponse,
) => dispatch(reducer({
  errors: [],
  path: path,
  status: RequestStatus.Success,
  requestData: requestData,
  responseData: responseData
}));

export const dispatchOnBefore = (
    dispatch: Dispatch,
    reducer: (params: ResponseArgs) => AnyAction,
    path: string,
    requestData: object
) => {
  dispatch(reducer({path: path, status: RequestStatus.Waiting, requestData: requestData, responseData: null, errors: []}));
};

export const handleErrors = (
    e: any,
    path: string,
    requestData: object,
    onFail: (params: ResponseArgs) => AnyAction,
    dispatch: Dispatch,
) => {
  if (e.message === "Network Error") {
    dispatchError(dispatch, onFail, path, requestData, null, ErrorType.NetworkError, "Network Error");
    return;
  }

  if (!e.response) {
    dispatchError(dispatch, onFail, path, requestData, null, ErrorType.EmptyResponse, "The response is empty");
    return;
  }

  if (e.response.status === 401) {
    dispatchError(dispatch, onFail, path, requestData, e.response, ErrorType.Unauthorized, "Unauthorized");
  } else if (e.response.status === 422) {
    dispatchError(dispatch, onFail, path, requestData, e.response, ErrorType.ServerError, "Server error");
  } else {
    dispatchError(dispatch, onFail, path, requestData, e.response, ErrorType.Unknown, e.response);
  }
};

const createFormDataFromFile = (file: File, propertyName: string) => {
  const formData = new FormData();
  formData.append(propertyName, file);
  return formData;
};

export const composeUrl = (url: string, requestData: object) => {
  let parametrizedUrl = url;

  for (const [key, value] of Object.entries(requestData)) {
    parametrizedUrl += `?${key}=${value}`;
  }

  return parametrizedUrl;
};
