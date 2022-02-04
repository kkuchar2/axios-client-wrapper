import React from 'react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import {RequestStatus} from "../../client/client.types";
import {tryGET} from "../testSlice";
import {testRequest} from "../test-utils";

const failedDataResponse = {data: 'no data available'};
const successDataResponse = {data: 'no data available'};

const ENDPOINT = 'get_endpoint';

const server = setupServer(...[
    rest.get(`api/${ENDPOINT}`, (req, res, ctx) => {
        const dummy = req.url.searchParams.get('dummyData')

        if (dummy === 'dummy') {
            return res(ctx.status(200), ctx.json(successDataResponse));
        }
        return res(ctx.status(422), ctx.json(failedDataResponse));
    }),
])

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close())

test('Test GET - Success Response', async () => {
    await testRequest(ENDPOINT, {dummyData: 'dummy'},
        RequestStatus.Success, tryGET, successDataResponse);
})

test('Test GET - Failed Response - 422', async () => {
    await testRequest(ENDPOINT, {},
        RequestStatus.Failure, tryGET, failedDataResponse);
})