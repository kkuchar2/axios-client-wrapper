import {AnyAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";

import {AxiosResponse} from "axios";
import {ResponseArgs} from "./client/client.types";
import {dispatchError, dispatchOtherError, dispatchSuccess, ErrorType} from "./client/client.utils";

export interface ResponseParserProps {
  path: string;
  dispatch: Dispatch;
  responseData: AxiosResponse;
  requestData: object;
  reducer: (params: ResponseArgs) => AnyAction;
}

export const applyBaseResponseParse = (props: ResponseParserProps) => {
  const {path, dispatch, responseData, requestData, reducer} = props;

  if (!responseData) {
    dispatchError(dispatch, reducer, path, requestData, responseData, ErrorType.EmptyResponse, "No response");
    return [true, null];
  }

  if (!responseData.data) {
    dispatchError(dispatch, reducer, path, requestData, responseData, ErrorType.EmptyResponseData, "No response data");
    return [true, null];
  }

  return [false, responseData.data];
};

export const defaultResponseParser = (props: ResponseParserProps) => {
  const {path, dispatch, requestData, reducer} = props;

  const [shouldExit, responseData] = applyBaseResponseParse(props);

  if (shouldExit) return;

  dispatchSuccess(dispatch, reducer, path, requestData, responseData);
};

export const customResponseParser = (props: ResponseParserProps) => {
  const {path, dispatch, reducer, requestData} = props;

  const [shouldExit, responseData] = applyBaseResponseParse(props);

  if (shouldExit) {
    return;
  }

  if (responseData.status === "success") {
    dispatchSuccess(dispatch, reducer, path, requestData, responseData);
  } else {
    dispatchOtherError(dispatch, reducer, path, requestData, responseData, []);
  }
};
