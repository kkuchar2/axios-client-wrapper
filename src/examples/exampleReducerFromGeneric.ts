import {createBaseRequestSlice, sendPostRequest} from "../genericReducer";

const exampleSlice = createBaseRequestSlice({name: 'exampleSlice'});

export const tryLogin = (user: string, password: string) => {
  return sendPostRequest({
    apiUrl: '127.0.0.1:8000/api',
    path: 'login',
    withCredentials: true,
    headers: {}
  }, exampleSlice);
};

export default exampleSlice.reducer;