import {createSlice, PayloadAction, Slice, SliceCaseReducers, ValidateSliceCaseReducers} from "@reduxjs/toolkit";
import {get, post, postFile} from "./requests";
import {BaseFileRequestArgs, BaseRequestArgs, ResponseArgs, RequestStatus} from "./client/client.types";

export const createBaseRequestSlice = <Reducers extends SliceCaseReducers<ResponseArgs>>({name = "", reducers}: {
  name: string;
  reducers?: ValidateSliceCaseReducers<ResponseArgs, Reducers>;
}) => {
  return createSlice({
    name: name,
    initialState: {
      path: "",
      status: RequestStatus.Unknown,
      requestData: {},
      responseData: null,
      errors: [],
    } as ResponseArgs,
    reducers: {
      reducer: (state: ResponseArgs, action: PayloadAction<ResponseArgs>) => {
        state.path = action.payload.path;
        state.responseData = action.payload.responseData;
        state.status = action.payload.status;
        state.requestData = action.payload.requestData;
        state.responseData = action.payload.responseData;
      },
      onReset: (state: ResponseArgs) => {
        state.path = "";
        state.status = RequestStatus.Unknown;
        state.requestData = {};
        state.responseData = null;
        state.errors = [];
      },
      ...reducers,
    },
  });
};

export const sendPostRequest = (args: BaseRequestArgs, slice: Slice<ResponseArgs>) => {
  return post({reducer: slice.actions.reducer, ...args});
};

export const sendGetRequest = (args: BaseRequestArgs, slice: Slice<ResponseArgs>) => {
  return get({reducer: slice.actions.reducer, ...args});
};

export const sendFilePostRequest = (requestArgs: BaseRequestArgs,
                                    fileRequestArgs: BaseFileRequestArgs,
                                    slice: Slice<ResponseArgs>) => {
  return postFile({reducer: slice.actions.reducer, ...requestArgs, ...fileRequestArgs});
};