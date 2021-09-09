import { Dispatch } from "redux";

import {
  FileRequestArgs,
  GetRequestArgs,
  PostRequestArgs,
} from "./clientTypes";
import {
  _handleErrors,
  _sendGetNoCookies,
  _sendGetWithCookiesAndCsrf,
  _sendPostFileNoCookies,
  _sendPostFileWithCookiesAndCsrf,
  _sendPostNoCookies,
  _sendPostWithCookiesAndCsrf,
} from "./clientFunctions";
import { defaultResponseParser } from "./responseParsers";

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
      dispatch(onBefore({ path, data: body, errors: [] }));

      const requestFunc = withAuthentication
        ? _sendPostWithCookiesAndCsrf
        : _sendPostNoCookies;

      const response = await requestFunc(buildApiUrl(apiUrl, path), body);

      responseParser({ path, dispatch, response, onSuccess, onFail });
    } catch (e) {
      const shouldExit = _handleErrors(e, path, onFail, dispatch);

      if (shouldExit) {
        return;
      }
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
      dispatch(onBefore({ path, data: params, errors: [] }));

      const requestFunc = withAuthentication
        ? _sendGetWithCookiesAndCsrf
        : _sendGetNoCookies;

      responseParser({
        path,
        dispatch,
        response: await requestFunc(buildApiUrl(apiUrl, path), params),
        onSuccess,
        onFail,
      });
    } catch (e) {
      const shouldExit = _handleErrors(e, path, onFail, dispatch);

      if (shouldExit) {
        return;
      }
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
      dispatch(onBefore({ path, data: null, errors: [] }));

      const requestFunc = withAuthentication
        ? _sendPostFileWithCookiesAndCsrf
        : _sendPostFileNoCookies;

      responseParser({
        path,
        dispatch,
        response: await requestFunc(
          buildApiUrl(apiUrl, path),
          file,
          onUploadProgress
        ),
        onSuccess,
        onFail,
      });
    } catch (e) {
      const shouldExit = _handleErrors(e, path, onFail, dispatch);

      if (shouldExit) {
        return;
      }
    }
  };
};
