import {defaultResponseParser} from "../responseParsers";
import {Dispatch} from "redux";
import {buildApiUrl} from "../common";
import {dispatchOnBefore, handleErrors, sendPut} from "../client/client.utils";
import {RequestArgs} from "../client/client.types";

export const put = (args: RequestArgs) => {
  const {
    apiUrl,
    path,
    requestData,
    reducer,
    responseParser = defaultResponseParser,
    withCredentials,
    headers,
  } = args;

  return async (dispatch: Dispatch) => {
    try {
      dispatchOnBefore(dispatch, reducer, path, requestData);

      responseParser({
        path,
        dispatch,
        responseData: await sendPut(buildApiUrl(apiUrl, path), requestData, withCredentials, headers),
        requestData,
        reducer
      });
    } catch (e) {
      handleErrors(e, path, requestData, reducer, dispatch);
    }
  };
};
