import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IRequestPathToResponseArgs, ResponseArgs} from "../client/client.types";
import {del, get, post, put} from "../requests";

export interface ITestSliceState {
    requestStates: IRequestPathToResponseArgs
}

const testSlice = createSlice({
    name: 'testSlice',
    initialState: {
        requestStates: {}
    } as ITestSliceState,
    reducers: {
        requestsReducer: (state: ITestSliceState, action: PayloadAction<ResponseArgs>) => {
            state.requestStates[action.payload.info.path] = action.payload;
        }
    }
});

export const tryPOST = (requestData: object) => {
    return post({
        apiUrl: 'api/',
        path: 'post_endpoint',
        reducer: requestsReducer,
        requestData: requestData,
        withCredentials: false,
        headers: {}
    });
};

export const tryGET = (requestData: object) => {
    return get({
        apiUrl: 'api/',
        path: 'get_endpoint',
        reducer: requestsReducer,
        requestData: requestData,
        withCredentials: false,
        headers: {}
    });
};

export const tryPUT = (requestData: object) => {
    return put({
        apiUrl: 'api/',
        path: 'put_endpoint',
        reducer: requestsReducer,
        requestData: requestData,
        withCredentials: false,
        headers: {}
    });
};

export const tryDELETE = (requestData: object) => {
    return del({
        apiUrl: 'api/',
        path: 'delete_data_endpoint',
        reducer: requestsReducer,
        requestData: requestData,
        withCredentials: false,
        headers: {}
    });
};

export const selectRequestsStates = state => state.test.requestStates;

export const {requestsReducer } = testSlice.actions;

export default testSlice.reducer;