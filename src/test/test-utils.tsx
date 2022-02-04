import React, {ReactElement, ReactNode} from 'react'
import {render as rtlRender, RenderOptions, RenderResult, waitFor} from '@testing-library/react'
import {configureStore, EnhancedStore} from '@reduxjs/toolkit'
import {Provider} from 'react-redux'
import testSlice from "./testSlice";
import {RequestStatus} from "../client/client.types";
import {App, RequestFunc} from "./App";
import {screen} from '@testing-library/react'

type ReduxRenderOptions = {
    preloadedState?: any;
    store?: EnhancedStore;
    renderOptions?: Omit<RenderOptions, "wrapper">;
};

export const render = (
    ui: ReactElement,
    {
        preloadedState = {},
        store = configureStore({ reducer: { test: testSlice }, preloadedState: preloadedState }),
        ...renderOptions
    }: ReduxRenderOptions = {}
): RenderResult => {

    const Wrapper = ({children}: { children?: ReactNode }): ReactElement => {
        return <Provider store={store}>{children}</Provider>;
    }
    return rtlRender(ui, {wrapper: Wrapper, ...renderOptions});
}

export const testCorrectStateUpdate = async (status: RequestStatus, path: string, requestData: object, responseData: object) => {
    await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(status.toString())
        expect(screen.getByRole('path')).toHaveTextContent(path)
        expect(screen.getByRole('requestData')).toHaveTextContent(JSON.stringify(requestData))
        expect(screen.getByRole('responseData')).toHaveTextContent(JSON.stringify(responseData))
    });
}

export const testRequest = async (path: string, requestData: object, endStatus: RequestStatus, requestFunc: RequestFunc, expectedResponseData: object) => {
    render(<App requestData={requestData} requestFunc={requestFunc} requestKey={path}/>)
    await testCorrectStateUpdate(RequestStatus.Waiting, path, requestData, null);
    await testCorrectStateUpdate(endStatus, path, requestData, expectedResponseData);
}

export * from '@testing-library/react'