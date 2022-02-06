import { AnyAction } from "@reduxjs/toolkit";

import { ResponseParserProps } from "../responseParsers";
import { AxiosRequestHeaders} from "axios";

export enum RequestStatus { Unknown, Waiting, Success, Failure}

export interface ResponseArgs<T = any> {
  path: string;
  status: RequestStatus;
  requestData: object;
  responseData: T;
  errors: Array<any>;
}

export interface BaseRequestArgs {
  apiUrl: string;
  path: string;
  responseParser?: (props: ResponseParserProps) => void;
  withCredentials?: boolean;
  headers?: AxiosRequestHeaders;
}

export interface RequestArgs<T = any> extends BaseRequestArgs {
  requestData?: object;
  reducer: (params: ResponseArgs<T>) => AnyAction;
}

export interface BaseFileRequestArgs extends BaseRequestArgs {
  file: File;
  filePropertyName: string;
  onUploadProgress: (progressEvent: any) => void;

}

export interface FileRequestArgs extends BaseFileRequestArgs {
  reducer: (params: ResponseArgs) => AnyAction;
}

// Map of request path to ResponseArgs
export interface IRequestPathToResponseArgs {
  [path: string]: ResponseArgs
}
