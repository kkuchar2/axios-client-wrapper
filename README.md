# axios-client-wrapper

[![npm version](https://badge.fury.io/js/axios-client-wrapper.svg)](https://www.npmjs.com/package/axios-client-wrapper)

React wrapper around [axios](https://axios-http.com/) to use with createSlice from "@reduxjs/toolkit"

It will dispatch actions just before request is made (Pending state)
and after request was complete (Success or Failure state)

Dispatched actions will contain information about:
  - path to which request was made
  - status of request
  - request data that was being sent
  - response data that was received (if any)
  - additional errors encountered along the way

## Install

Via package managers:

```bash
# With npm
npm i axios-client-wrapper

# With Yarn
yarn add axios-client-wrapper
```

## Example usage with simple slice just for one request

```js
const simpleSlice = createBaseRequestSlice({name: 'simpleSlice'});

export const tryLogin = (user: string, password: string) => {
    return sendPostRequest({
        apiUrl: '127.0.0.1:8000/api',
        path: 'login',
        withCredentials: true,
        headers: {}
    }, simpleSlice);
};

export default simpleSlice.reducer;
```

## Example usage for slice with many requests


This example slice file has multiple exposed functions 
that do call this library requests.



```js

export interface ITestSliceState {
    data: object
}

// Create slice
const testSlice = createSlice({
    name: 'testReducer',
    initialState: {
        data: null
    } as ITestSliceState,

    // Create reducer that will be passed as request argument
    // It will be called before request and after (either on success or on failure)
    reducers: {
        someReducer: (state: ITestSliceState, action: PayloadAction<ResponseArgs>) => {
            const {path, status, requestData, responseData, errors} = action.payload;
            state.data = responseData;
            // do something based on 'path' identifier or data received 
        }
    }
});

export const postSomething = (requestData: object) => {
    return post({ apiUrl: 'api/', path: 'someEndpoint', reducer: someReducer, requestData: requestData});
};

export const postSomethingElse = (requestData: object) => {
    return post({ apiUrl: 'api/', path: 'someOtherEndpoint', reducer: someReducer, requestData: requestData});
};


export const selectData = state => state.someSlice.data;

export const {someReducer} = testSlice.actions;

export default testSlice.reducer;
```
