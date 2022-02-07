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
      info: {
        path: '',
        status: RequestStatus.Unknown,
        requestData: {},
        errors: []
      },
      responseData: null
    } as ResponseArgs,
    reducers: {
      reducer: (state: ResponseArgs, action: PayloadAction<ResponseArgs>) => {
        state.info = action.payload.info;
        state.responseData = action.payload.responseData;
      },
      onReset: (state: ResponseArgs) => {
        state.info = {
          path: '',
          status: RequestStatus.Unknown,
          requestData: {},
          errors: []
        }
        state.responseData = {}
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