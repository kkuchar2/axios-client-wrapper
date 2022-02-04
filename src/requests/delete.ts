import { defaultResponseParser } from "../responseParsers";
import { Dispatch } from "redux";
import { buildApiUrl } from "../common";
import { RequestArgs } from "../client/client.types";
import { dispatchOnBefore, handleErrors, sendDelete } from "../client/client.utils";

export const del = (args: RequestArgs) => {
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
        responseData: await sendDelete(buildApiUrl(apiUrl, path), requestData, withCredentials, headers),
        requestData,
        reducer
      });
    } catch (e) {
      handleErrors(e, path, requestData, reducer, dispatch);
    }
  };
};
