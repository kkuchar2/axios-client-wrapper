import React from 'react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import {RequestStatus} from "../../client/client.types";
import {tryPOST} from "../testSlice";
import {testRequest} from "../test-utils";

const successLoginResponse = {message: 'logged in'};
const failedLoginResponse = {message: 'missing password or email'};

const ENDPOINT = 'post_endpoint';

const server = setupServer(...[
    rest.post(`api/${ENDPOINT}`, (req, res, ctx) => {
        const body = req.body['data'];

        if (!('email' in body) || !('password' in body)) {
            return res(ctx.status(422), ctx.json(failedLoginResponse))
        }
        return res(ctx.status(200), ctx.json(successLoginResponse));
    }),
])

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close())

test('Test POST - Success Response', async () => {
    await testRequest(ENDPOINT, {
        email: 'user@user.com',
        password: '12345'
    }, RequestStatus.Success, tryPOST, successLoginResponse);
})

test('Test POST - Failed Response - 422', async () => {
    await testRequest(ENDPOINT, {
        email: 'user@user.com'
    }, RequestStatus.Failure, tryPOST, failedLoginResponse);
})