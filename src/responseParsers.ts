import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "redux";

import { OnFailArgs, OnSuccessArgs } from "./clientTypes";

export interface ResponseParserProps {
  path: string;
  dispatch: Dispatch;
  response: any;
  onSuccess: (params: OnSuccessArgs) => AnyAction;
  onFail: (params: OnFailArgs) => AnyAction;
}

export const baseResponseParser = (props: ResponseParserProps) => {
  const { path, dispatch, response, onFail } = props;

  if (!response) {
    dispatch(onFail("No response"));
    return [true, null];
  }

  const responseData = response.data;

  if (responseData === undefined) {
    dispatch(onFail({ errors: { any: ["no_response_data"] }, path }));
    return [true, null];
  }

  return [false, responseData];
};

export const defaultResponseParser = (props: ResponseParserProps) => {
  const { path, dispatch, onSuccess } = props;

  const [shouldExit, responseData] = baseResponseParser(props);

  if (shouldExit) {
    return;
  }

  dispatch(onSuccess({ errors: [], path, data: responseData }));
};

export const customResponseParser = (props: ResponseParserProps) => {
  const { path, dispatch, onSuccess, onFail } = props;

  const [shouldExit, responseData] = baseResponseParser(props);

  if (shouldExit) {
    return;
  }

  // Parse status and inner data from my custom API
  const status = responseData.status;

  if (!status) {
    dispatch(onFail({
          path,
          errors: [
            { any: ["no_response_data"] }
          ]
    }));
    return;
  }

  const message = responseData.data;

  if (status === "success") {
    dispatch(onSuccess({
      path,
      data: message,
      errors: []
    }));
  } else {
    dispatch(onFail({
      errors: [message],
      path
    }));
  }
};
