import React from 'react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import {RequestStatus} from "../../client/client.types";
import {tryPUT} from "../testSlice";
import {testRequest} from "../test-utils";

const successResponse = {message: 'success'};
const failedResponse = {message: 'failed'};

const ENDPOINT = 'put_endpoint';

const server = setupServer(...[
    rest.put(`api/${ENDPOINT}`, (req, res, ctx) => {
        const dummyData = req.body['dummyData'];
        if (!dummyData) {
            return res(ctx.status(422), ctx.json(failedResponse))
        }
        return res(ctx.status(200), ctx.json(successResponse));
    })
])

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close())

test('Test PUT - Success Response', async () => {
    await testRequest(ENDPOINT, { dummyData: 'dummy'}, RequestStatus.Success, tryPUT, successResponse);
})

test('Test PUT - Failed Response - 422', async () => {
    await testRequest(ENDPOINT, {}, RequestStatus.Failure, tryPUT, failedResponse);
})