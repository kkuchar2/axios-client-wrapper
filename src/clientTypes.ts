import { AnyAction } from '@reduxjs/toolkit'

import {ResponseParserProps} from "./responseParsers";

export interface Dictionary<T> {
  [Key: string]: T;
}

export interface OnBeforeArgs {
    path: string,
    errors: string[],
    // tslint:disable-next-line: no-any
    data: any
}

// tslint:disable-next-line: no-empty-interface
export interface OnFailArgs {

}

// tslint:disable-next-line: no-empty-interface
export interface OnSuccessArgs {

}

export interface BaseRequestArgs {
    apiUrl: string,
    path: string,
    onBefore: (params: OnBeforeArgs) => AnyAction,
    onSuccess: (params: OnSuccessArgs) => AnyAction,
    onFail: (params: OnFailArgs) => AnyAction,
    responseParser?: (props: ResponseParserProps) => void,
    withAuthentication?: boolean
}

export interface PostRequestArgs extends BaseRequestArgs {
    // tslint:disable-next-line: no-any
    body?: Dictionary<any>
}

export interface GetRequestArgs extends BaseRequestArgs {
    params?: Dictionary<string>
}

export interface FileRequestArgs extends BaseRequestArgs {
    file: File,
    // tslint:disable-next-line: no-any
    onUploadProgress: (progressEvent: any) => void
}
