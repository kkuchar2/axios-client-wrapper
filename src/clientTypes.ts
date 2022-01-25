import { AnyAction } from "@reduxjs/toolkit";

import { ResponseParserProps } from "./responseParsers";

export interface OnBeforeArgs {
  path: string;
  errors: Array<any>;
  data: any;
}

export interface OnFailArgs {
  path: string;
  data: any;
  errors: Array<any>;
}

export interface OnSuccessArgs {
  path: string;
  data: any;
}

export interface BaseRequestArgs {
  apiUrl: string;
  path: string;
  onBefore: (params: OnBeforeArgs) => AnyAction;
  onSuccess: (params: OnSuccessArgs) => AnyAction;
  onFail: (params: OnFailArgs) => AnyAction;
  responseParser?: (props: ResponseParserProps) => void;
  withAuthentication?: boolean;
}

export interface PostRequestArgs extends BaseRequestArgs {
  body?: Object;
}

export interface GetRequestArgs extends BaseRequestArgs {
  params?: Object;
}

export interface PutRequestArgs extends BaseRequestArgs {
  data?: Object;
}

export interface FileRequestArgs extends BaseRequestArgs {
  file: File;
  onUploadProgress: (progressEvent: any) => void;
}
