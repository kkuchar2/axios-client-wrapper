import React from 'react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import {RequestStatus} from "../../client/client.types";
import {tryDELETE, tryPUT} from "../testSlice";
import {testRequest} from "../test-utils";

const successResponse = {message: 'success'};
const failedResponse = {message: 'failed'};

const ENDPOINT = 'delete_data_endpoint';

const server = setupServer(...[
    rest.delete(`api/${ENDPOINT}`, (req, res, ctx) => {

        const body = req.body;

        if (!body['dummyData']) {
            return res(ctx.status(422), ctx.json(failedResponse));
        }

        return res(ctx.status(200), ctx.json(successResponse));
    })
])

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close())

test('Test DELETE - Success Response', async () => {
    await testRequest(ENDPOINT, {
            dummyData: 'dummy',
        }, RequestStatus.Success, tryDELETE, successResponse);
})

test('Test DELETE - Failed Response - 422', async () => {
    await testRequest(ENDPOINT, {},
        RequestStatus.Failure, tryDELETE, failedResponse);
})