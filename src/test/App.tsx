import React, {useCallback, useEffect} from 'react'
import {Dispatch} from "redux";
import {selectRequestsStates} from './testSlice'
import {useDispatch, useSelector} from "react-redux";

export declare type RequestFunc = (requestData: object) => (dispatch: Dispatch) => Promise<void>;

export interface AppProps {
    requestData: object;
    requestFunc: RequestFunc
    requestKey: string
}

export const App = (props: AppProps) => {

    const {requestData, requestFunc, requestKey} = props;

    const dispatch = useDispatch()
    const requestState = useSelector(selectRequestsStates)[requestKey]

    useEffect(() => {
        dispatch(requestFunc(requestData))
    }, []);

    const renderInfoProperty = useCallback((propertyName: string) => {
        if (!requestState) return;

        if (!requestState.info[propertyName]) {
            return <div role={propertyName}>{'null'}</div>
        }



        return <div role={propertyName}>{JSON.stringify(requestState.info[propertyName])}</div>;

    }, [requestState]);

    const renderResponseProperty = useCallback(() => {
        if (!requestState) return;

        if (!requestState.responseData) {
            return <div role={'responseData'}>{'null'}</div>
        }

        return <div role={'responseData'}>{JSON.stringify(requestState.responseData)}</div>;

    }, [requestState]);


    return <div>
        <button role={'reset'}>Reset state</button>
        {renderInfoProperty('status')}
        {renderInfoProperty('path')}
        {renderInfoProperty('requestData')}
        {renderResponseProperty()}
    </div>
};