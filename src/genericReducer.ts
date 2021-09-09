import {
    createSlice,
    Dictionary,
    PayloadAction,
    Slice,
    SliceCaseReducers,
    ValidateSliceCaseReducers
} from "@reduxjs/toolkit";
import {sendFilePost, sendGet, sendPost} from "./client";

export interface IResponsePayload {
    path: string,
    errors: any,
    data: any
}

export enum RequestState {
    Idle,
    Pending,
    ResponseReceived
}

export interface BaseRequestSliceState {
    path: string,
    requestState: RequestState,
    responseData: Dictionary<any>,
    errors: Array<string>
}

export interface BeforeRequestPayload {
    path: string
}

export const createBaseRequestSlice = <Reducers extends SliceCaseReducers<BaseRequestSliceState>>(
    { name = '', reducers}: {
    name: string
    reducers?: ValidateSliceCaseReducers<BaseRequestSliceState, Reducers>
}) => {
    return createSlice({
        name,
        initialState: {
            path: '',
            requestState: RequestState.Idle,
            responseData: {},
            errors: []
        } as BaseRequestSliceState,
        reducers: {
            onRequestSent: (state, action: PayloadAction<BeforeRequestPayload>) => {
                const {path = ''} = action.payload ? action.payload : {};
                state.requestState = RequestState.Pending;
                state.path = path;
            },
            onRequestSuccess: (state, action: PayloadAction<IResponsePayload>) => {
                const {errors = [], path = '', data = {}} = action.payload ? action.payload : {};
                state.errors = errors;
                state.path = path;
                state.requestState = RequestState.ResponseReceived;
                state.responseData = data;
            },
            onRequestFailed: (state: BaseRequestSliceState, action: PayloadAction<IResponsePayload>) => {
                const {errors = [], path = '', data = {}} = action.payload ? action.payload : {};
                state.path = path;
                state.requestState = RequestState.ResponseReceived;
                state.responseData = data;
                state.errors = errors;
            },
            onReset: (state: BaseRequestSliceState) => {
                state.path = '';
                state.requestState = RequestState.Idle;
                state.responseData = {};
                state.errors = [];
            },
            ...reducers,
        },
    });
};

export const sendPostRequest = (apiUrl: string, path: string, body: object, slice: Slice<BaseRequestSliceState>) => {
    return sendPost({
        apiUrl: apiUrl,
        path: path,
        onBefore: slice.actions.onRequestSent,
        onSuccess: slice.actions.onRequestSuccess,
        onFail: slice.actions.onRequestFailed,
        body: body,
        withAuthentication: false
    });
};

export const sendGetRequest = (apiUrl: string, path: string, slice: Slice<BaseRequestSliceState>) => {
    return sendGet({
        apiUrl: apiUrl,
        path: path,
        onBefore: slice.actions.onRequestSent,
        onSuccess: slice.actions.onRequestSuccess,
        onFail: slice.actions.onRequestFailed,
        params: {
            "q": "j%20k%20rowling"
        },
        withAuthentication: false
    });
};

export const sendFilePostRequest = (apiUrl: string, path: string, file: File, onUploadProgress: (progressEvent: any) => void = evt => {},
    slice: Slice<BaseRequestSliceState>) => {

    return sendFilePost({
        apiUrl: apiUrl,
        path: path,
        onBefore: slice.actions.onRequestSent,
        onSuccess: slice.actions.onRequestSuccess,
        onFail: slice.actions.onRequestFailed,
        file: file,
        onUploadProgress: onUploadProgress,
        withAuthentication: false
    });
};