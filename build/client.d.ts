import { Dispatch } from "redux";
import { FileRequestArgs, GetRequestArgs, PostRequestArgs } from "./clientTypes";
export declare const sendPost: (args: PostRequestArgs) => (dispatch: Dispatch) => Promise<void>;
export declare const sendGet: (args: GetRequestArgs) => (dispatch: Dispatch) => Promise<void>;
export declare const sendFilePost: (params: FileRequestArgs) => (dispatch: Dispatch) => Promise<void>;
