import {AnyAction} from "@reduxjs/toolkit";
import axios from "axios";
import {Dispatch} from "redux";
import Cookies from "universal-cookie/es6";

import {Dictionary, OnFailArgs} from "./clientTypes";

export const _sendPostNoCookies = async (url: string, body: Dictionary<any>) => axios.post(url, body);

export const _sendPostWithCookiesAndCsrf = async (url: string, body: Dictionary<any>) => {
    return axios.post(url, body, {
        withCredentials: true,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFTOKEN': new Cookies().get('csrftoken')
        }
    });
};

export const _sendPostFileNoCookies = async (url: string, file: File) => {
    const data = new FormData();
    data.append('title', 'ProfileImage');
    data.append('text', 'random_text');
    data.append('img', file);

    return axios.post(url, data, {
        // tslint:disable-next-line: no-empty
        onUploadProgress: () => {}
    });
};

export const _sendPostFileWithCookiesAndCsrf = async (url: string, file: File, onUploadProgress: (progressEvent: any) => void) => {
    const data = new FormData();
    data.append('title', 'ProfileImage');
    data.append('text', 'random_text');
    data.append('img', file);

    return axios.post(url, data, {
        withCredentials: true,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFTOKEN': new Cookies().get('csrftoken')
        },
        onUploadProgress
    });
};

export const _sendGetNoCookies = async (url: string, params: Dictionary<string>) => {
    let parametrizedUrl = url;

    for (const [key, value] of Object.entries(params)) {
        parametrizedUrl += `?${key}=${value}`;
    }

    return axios.get(parametrizedUrl, {headers: {'Accept': 'application/json'}});
};

export const _sendGetWithCookiesAndCsrf = async (url: string, params: Dictionary<string>) => {
    let parametrizedUrl = url;

    for (const [key, value] of Object.entries(params)) {
        parametrizedUrl += `?${key}=${value}`;
    }

    return axios.get(parametrizedUrl, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFTOKEN': new Cookies().get('csrftoken')
        }
    });
};

////////////////////////////////////////////////////////////////////////////

export const _handleErrors = (e: any, url: string, onFail: (params: OnFailArgs) => AnyAction, dispatch: Dispatch) => {
    if (e.message === 'Network Error') {
        dispatch(onFail({errors: createNetworkError(url), url}));
        return true;
    }

    if (!e.response) {
        dispatch(onFail({errors: {"any": ["unknown_error"]}, url}));
        return true;
    }

    // tslint:disable-next-line: no-magic-numbers
    if (e.response.status === 401) {
        dispatch(onFail({errors: {"any": ["unauthorized"]}, url}));
    } else {
        dispatch(onFail({"any": ["unknown_error"]}));
    }
};

///////////////////////////////////////////////////////////////////////////

const createNetworkError = (source: string) => {
    return {
        generic: {type: "network_error", message: "NETWORK_ERROR", source}
    };
};
