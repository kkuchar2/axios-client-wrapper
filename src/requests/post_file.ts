import {defaultResponseParser} from "../responseParsers";
import {Dispatch} from "redux";
import {buildApiUrl} from "../common";
import {dispatchOnBefore, handleErrors, sendPostFile} from "../client/client.utils";
import {FileRequestArgs} from "../client/client.types";

export const postFile = <T = any> (args: FileRequestArgs) => {
  const {
    apiUrl,
    path,
    file,
    filePropertyName,
    reducer,
    responseParser = defaultResponseParser,
    onUploadProgress,
    withCredentials,
    headers,
  } = args;

  return async (dispatch: Dispatch) => {
    try {
      dispatchOnBefore(dispatch, reducer, path, {});

      responseParser({
        path,
        dispatch,
        responseData: await sendPostFile<T>(
            buildApiUrl(apiUrl, path),
            file,
            filePropertyName,
            withCredentials,
            headers,
            onUploadProgress,
        ),
        requestData: {},
        reducer,
      });
    } catch (e) {
      handleErrors(e, path, {}, reducer, dispatch);
    }
  };
};
