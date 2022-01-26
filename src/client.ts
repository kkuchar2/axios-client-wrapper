import {Dispatch} from "redux";

import {DeleteRequestArgs, FileRequestArgs, GetRequestArgs, PostRequestArgs, PutRequestArgs} from "./clientTypes";
import {
  _handleErrors,
  _sendGetNoCookies,
  _sendGetWithCookiesAndCsrf,
  _sendPostFileNoCookies,
  _sendPostFileWithCookiesAndCsrf,
  _sendPostNoCookies,
  _sendPostWithCookiesAndCsrf,
  _sendPutNoCookies,
  _sendPutWithCookiesAndCsrf,
  _sendDeleteNoCookies,
  _sendDeleteWithCookiesAndCsrf,
  dispatchOnBefore,
} from "./clientFunctions";
import {defaultResponseParser} from "./responseParsers";

const buildApiUrl = (apiUrl: string, path: string) => apiUrl + path;

export const sendPost = (args: PostRequestArgs) => {
  const {
    apiUrl,
    path,
    onBefore,
    onSuccess,
    onFail,
    responseParser = defaultResponseParser,
    withAuthentication,
    body = {},
  } = args;

  return async (dispatch: Dispatch) => {
    try {
      dispatchOnBefore(dispatch, onBefore, path, body);

      const requestFunc = withAuthentication ? _sendPostWithCookiesAndCsrf : _sendPostNoCookies;

      const responseData = await requestFunc(buildApiUrl(apiUrl, path), body);

      responseParser({path, dispatch, responseData, requestData: body, onSuccess, onFail});
    } catch (e) {
      _handleErrors(e, path, onFail, dispatch);
    }
  };
};

export const sendGet = (args: GetRequestArgs) => {
  const {
    apiUrl,
    path,
    onBefore,
    onSuccess,
    onFail,
    responseParser = defaultResponseParser,
    withAuthentication,
    params,
  } = args;

  return async (dispatch: Dispatch) => {
    try {
      dispatchOnBefore(dispatch, onBefore, path, params);

      const requestFunc = withAuthentication ? _sendGetWithCookiesAndCsrf : _sendGetNoCookies;

      responseParser({
        path,
        dispatch,
        responseData: await requestFunc(buildApiUrl(apiUrl, path), params),
        requestData: params,
        onSuccess,
        onFail,
      });
    } catch (e) {
      _handleErrors(e, path, onFail, dispatch);
    }
  };
};

export const sendPut = (args: PutRequestArgs) => {
  const {
    apiUrl,
    path,
    onBefore,
    onSuccess,
    onFail,
    responseParser = defaultResponseParser,
    withAuthentication,
    requestData,
  } = args;

  return async (dispatch: Dispatch) => {
    try {
      dispatchOnBefore(dispatch, onBefore, path, requestData);

      const requestFunc = withAuthentication ? _sendPutWithCookiesAndCsrf : _sendPutNoCookies;

      responseParser({
        path,
        dispatch,
        responseData: await requestFunc(buildApiUrl(apiUrl, path), requestData),
        requestData: requestData,
        onSuccess,
        onFail,
      });
    } catch (e) {
      _handleErrors(e, path, onFail, dispatch);
    }
  };
};

export const sendDelete = (args: DeleteRequestArgs) => {
  const {
    apiUrl,
    path,
    onBefore,
    onSuccess,
    onFail,
    responseParser = defaultResponseParser,
    withAuthentication,
    requestData,
  } = args;

  return async (dispatch: Dispatch) => {
    try {
      dispatchOnBefore(dispatch, onBefore, path, requestData);

      const requestFunc = withAuthentication ? _sendDeleteWithCookiesAndCsrf : _sendDeleteNoCookies;

      responseParser({
        path,
        dispatch,
        responseData: await requestFunc(buildApiUrl(apiUrl, path), requestData),
        requestData,
        onSuccess,
        onFail,
      });
    } catch (e) {
      _handleErrors(e, path, onFail, dispatch);
    }
  };
};

export const sendFilePost = (params: FileRequestArgs) => {
  const {
    apiUrl,
    path,
    onBefore,
    onSuccess,
    onFail,
    responseParser = defaultResponseParser,
    withAuthentication,
    file,
    onUploadProgress,
  } = params;

  return async (dispatch: Dispatch) => {
    try {
      dispatchOnBefore(dispatch, onBefore, path, null);

      const requestFunc = withAuthentication ? _sendPostFileWithCookiesAndCsrf : _sendPostFileNoCookies;

      responseParser({
        path,
        dispatch,
        responseData: await requestFunc(buildApiUrl(apiUrl, path), file, onUploadProgress),
        requestData: {},
        onSuccess,
        onFail,
      });
    } catch (e) {
      _handleErrors(e, path, onFail, dispatch);
    }
  };
};
