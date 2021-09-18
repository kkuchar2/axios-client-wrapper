import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "redux";

import { OnFailArgs, OnSuccessArgs } from "./clientTypes";
import { dispatchError, dispatchOtherError, dispatchSuccess, ErrorType } from "./clientFunctions";

export interface ResponseParserProps {
  path: string;
  dispatch: Dispatch;
  response: any;
  onSuccess: (params: OnSuccessArgs) => AnyAction;
  onFail: (params: OnFailArgs) => AnyAction;
}

export const applyBaseResponseParse = (props: ResponseParserProps) => {
  const { path, dispatch, response, onFail } = props;

  if (!response) {
    dispatchError(dispatch, onFail, path, ErrorType.EmptyResponse, "Missing response");
    return [true, null];
  }

  const responseData = response.data;

  if (responseData) {
    dispatchError(dispatch, onFail, path, ErrorType.EmptyResponseData, "Missing response data");
    return [true, null];
  }

  return [false, responseData];
};

export const defaultResponseParser = (props: ResponseParserProps) => {
  const { path, dispatch, onSuccess } = props;

  const [shouldExit, responseData] = applyBaseResponseParse(props);

  if (shouldExit) {
    return;
  }

  dispatchSuccess(dispatch, onSuccess, path, responseData);
};

export const customResponseParser = (props: ResponseParserProps) => {
  const { path, dispatch, onSuccess, onFail } = props;

  const [shouldExit, responseData] = applyBaseResponseParse(props);

  if (shouldExit) {
    return;
  }

  const status = responseData.status;
  const message = responseData.data;

  if (status === "success") {
    dispatchSuccess(dispatch, onSuccess, path, message);
  } else {
    dispatchOtherError(dispatch, onFail, path, message);
  }
};
