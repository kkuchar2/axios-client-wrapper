import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IRequestPathToResponseArgs, ResponseArgs} from "../client/client.types";
import {post} from "../requests";
import {Dispatch} from "redux";

interface IExampleSliceState {
  requestStates: IRequestPathToResponseArgs
}

const exampleSlice = createSlice({
  name: 'exampleSlice',
  initialState: {
    requestStates: {}
  } as IExampleSliceState,
  reducers: {
    requestReducer: (state: IExampleSliceState, action: PayloadAction<ResponseArgs>) => {
      state.requestStates[action.payload.path] = action.payload;

      // Optional logic:
      if (action.payload.path === 'login') {
        // do something
      }

      if (action.payload.path === 'register') {
        // do something
      }
    },
    onReset: (state: IExampleSliceState) => {
      state.requestStates = {};
    }
  }
});

export const tryLogin = (user: string, password: string) => {
  return post({
    apiUrl: '127.0.0.1:8000/api',
    path: 'login',
    reducer: requestReducer,
    requestData: {user: user, password: password},
    withCredentials: true,
    headers: {}
  });
};


export const tryRegister = (email: string, password: string) => {
  return post({
    apiUrl: 'api',
    path: 'register',
    reducer: requestReducer,
    requestData: {email: email, password: password},
    withCredentials: true,
    headers: {}
  });
};

export const resetExampleSliceState = () => (dispatch : Dispatch) => dispatch(onReset());

export const {requestReducer, onReset} = exampleSlice.actions;