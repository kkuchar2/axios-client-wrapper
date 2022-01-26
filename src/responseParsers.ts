import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "redux";

import { OnFailArgs, OnSuccessArgs } from "./clientTypes";
import { dispatchError, dispatchOtherError, dispatchSuccess, ErrorType } from "./clientFunctions";

export interface ResponseParserProps {
  path: string;
  dispatch: Dispatch;
  responseData: any;
  requestData: Object,
  onSuccess: (params: OnSuccessArgs) => AnyAction;
  onFail: (params: OnFailArgs) => AnyAction;
}

export const applyBaseResponseParse = (props: ResponseParserProps) => {
  const { path, dispatch, responseData, requestData, onFail } = props;

  if (!responseData) {
    dispatchError(dispatch, onFail, path, ErrorType.EmptyResponse, "Missing response");
    return [true, null];
  }

  const responseDataInner = responseData.data;

  if (!responseDataInner) {
    dispatchError(dispatch, onFail, path, ErrorType.EmptyResponseData, "Missing response data");
    return [true, null];
  }

  return [false, responseData];
};

export const defaultResponseParser = (props: ResponseParserProps) => {
  const { path, dispatch, requestData, onSuccess } = props;

  const [shouldExit, responseData] = applyBaseResponseParse(props);

  if (shouldExit) {
    return;
  }

  dispatchSuccess(dispatch, onSuccess, path, responseData, requestData);
};

export const customResponseParser = (props: ResponseParserProps) => {
  const { path, dispatch, onSuccess, onFail, requestData } = props;

  const [shouldExit, responseData] = applyBaseResponseParse(props);

  if (shouldExit) {
    return;
  }

  const status = responseData.status;
  const message = responseData.data;

  if (status === "success") {
    dispatchSuccess(dispatch, onSuccess, path, message, requestData);
  } else {
    dispatchOtherError(dispatch, onFail, path, message, requestData);
  }
};
