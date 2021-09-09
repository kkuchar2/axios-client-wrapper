import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { OnFailArgs, OnSuccessArgs } from "./clientTypes";
export interface ResponseParserProps {
    path: string;
    dispatch: Dispatch;
    response: any;
    onSuccess: (params: OnSuccessArgs) => AnyAction;
    onFail: (params: OnFailArgs) => AnyAction;
}
export declare const baseResponseParser: (props: ResponseParserProps) => any[];
export declare const defaultResponseParser: (props: ResponseParserProps) => void;
export declare const customResponseParser: (props: ResponseParserProps) => void;
