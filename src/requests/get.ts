import {defaultResponseParser} from "../responseParsers";
import {Dispatch} from "redux";
import {buildApiUrl} from "../common";
import {RequestArgs} from "../client/client.types";
import {dispatchOnBefore, handleErrors, sendGet} from "../client/client.utils";

export const get = <T = any> (args: RequestArgs) => {
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
                responseData: await sendGet<T>(buildApiUrl(apiUrl, path), requestData, withCredentials, headers),
                requestData,
                reducer
            });
        } catch (e) {
            handleErrors(e, path, requestData, reducer, dispatch);
        }
    };
};
