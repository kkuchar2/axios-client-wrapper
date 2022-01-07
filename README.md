# axios-client-wrapper

[![npm version](https://badge.fury.io/js/axios-client-wrapper.svg)](https://www.npmjs.com/package/axios-client-wrapper)

React wrapper around [axios](https://axios-http.com/).

## Install

Via package managers:

```bash
# With npm
npm i axios-client-wrapper

# With Yarn
yarn add axios-client-wrapper
```

## Usage

POST request:
```js
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {API_URL, AppDispatch, RootState} from "appRedux/store";
import {customResponseParser, RequestState, RequestStatus, sendFilePost} from "axios-client-wrapper";

const authSlice = createSlice({
    name: "auth",
    initialState: {},
    reducers: {
        sentLoginRequest: (state, action) => {},
        onRequestSuccess: (state, action) => {},
        onRequestFailure: (state, action) => {}
    },
});

/**
 
  Following function will:
  
  POST request to '0.0.0.0:5000/api/dummy/login'
  Include body with parameters
  Define slice handlers on request sent, success and failure
  
  It will also include authentication data with axios post function:
 
  axios.post(fullUrl, body, { withCredentials: true, headers: _getAuthenticationHeaders() });
     
  Where authentication headers are:
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "X-CSRFTOKEN": new Cookies().get("csrftoken"),
 
 */

export const sendLogin = (user: string, password: string) => {
    return sendPost({
        apiUrl: '0.0.0.0:5000/api',
        path: 'dummy/login',
        onBefore: sentLoginRequest,
        onSuccess: loginSuccess,
        onFail: loginFailed,
        responseParser: customResponseParser,
        body: {email: user, password: password},
        withAuthentication: true // if false it won't include auth headers
    });
};


export const {
    sentLoginRequest,
    loginSuccess,
    loginFailed,
} = authSlice.actions;

export default authSlice.reducer;
```

GET request:

```js
import {createSlice} from "@reduxjs/toolkit";
import {customResponseParser, sendGet} from "axios-client-wrapper";

const myDataSlice = createSlice({
    name: "mydata",
    initialState: {},
    reducers: {
        sentGetData: (state, action) => {
            // do sth with action.payload.data
        },
        onGetDataSuccess: (state, action) => {
            // do sth with action.payload.data
        },
        onGetDataFailure: (state, action) => {
            // do sth with action.payload.errors
        }
    },
});

/**
  GET request to '0.0.0.0:5000/api/dummy/data'
 */

export const requestData = (user: string, password: string) => {
    return sendGet({
        apiUrl: '0.0.0.0:5000/api',
        path: 'dummy/data',
        onBefore: sentGetData,
        onSuccess: onGetDataSuccess,
        onFail: onGetDataFailure,
        responseParser: customResponseParser,
        params: {}, // GET params parsed into ?param1=value1?param2=value2 ...
        withAuthentication: true
    });
};


export const {
    sentGetData,
    onGetDataSuccess,
    onGetDataFailure,
} = myDataSlice.actions;

export default myDataSlice.reducer;
```
