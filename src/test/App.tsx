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

    const renderProperty = useCallback((propertyName: string) => {
        if (!requestState) return;

        if (!requestState[propertyName]) {
            return <div role={propertyName}>{'null'}</div>
        }

        return <div role={propertyName}>{JSON.stringify(requestState[propertyName])}</div>;

    }, [requestState]);

    return <div>
        <button role={'reset'}>Reset state</button>
        {renderProperty('status')}
        {renderProperty('path')}
        {renderProperty('requestData')}
        {renderProperty('responseData')}
    </div>
};