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


Example:

someSlice.ts:

```js

import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "appRedux/store";
import {RequestStatus, ResponseArgs, DefaultResponseArgs} from "axios-client-wrapper";

interface ISliceState {
    changeEmailAddress: ResponseArgs
}


export const someSlice = createSlice({
    name: "someSlice",
    initialState: {
        changeEmailAddress: DefaultResponseArgs(),
    } as ISliceState,
    reducers: {
        changeEmailAddress: (state: IUserSliceState, action: PayloadAction<ResponseArgs>) => {
            state.changeEmailAddress = action.payload;
        },
    }
});

export const { actions } = someSlice;

```

someService.ts:

```js

import { actions } from "./someSlice";

export const changeEmailAddress = (currentEmail: string, newEmail: string, password: string) => {
    return post({
        apiUrl: '0.0.0.0/api/',
        path: 'changeEmail', 
        reducer: actions.changeEmailAddress, // which reducer should be called on before / after dispatch
        withCredentials: true,
        requestData: {
            currentEmail: currentEmail,
            newEmail: newEmail,
            password: password
        },
        headers: {}
    });
};
```
