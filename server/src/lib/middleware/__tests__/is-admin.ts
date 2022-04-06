// import * as request from 'supertest'
// import { app } from '../../../app'
import { NextFunction, Response } from "express"
import isAdmin from "@lib/middleware/is-admin"
import { UserJwtRequest } from "@lib/middleware/jwt"

describe("is-admin middlware", () => {
	let mockRequest: Partial<UserJwtRequest>
	let mockResponse: Partial<Response>
	let nextFunction: NextFunction = jest.fn()

	beforeEach(() => {
		mockRequest = {}
		mockResponse = {
			sendStatus: jest.fn()
		}
	})

	it("should return 401 if no authorization header", async () => {
		const res = mockResponse as Response
		isAdmin(mockRequest as UserJwtRequest, res, nextFunction)
		expect(res.sendStatus).toHaveBeenCalledWith(401)
	})

	it("should return 401 if no token is supplied", async () => {
		const req = mockRequest as UserJwtRequest
		req.headers = {
			authorization: "Bearer"
		}
		isAdmin(req, mockResponse as Response, nextFunction)
		expect(mockResponse.sendStatus).toBeCalledWith(401)
	})

	it("should return 404 if config.enable_admin is false", async () => {
		jest.mock("../../config", () => ({
			enable_admin: false
		}))

		const req = mockRequest as UserJwtRequest
		req.headers = {
			authorization: "Bearer 123"
		}
		isAdmin(req, mockResponse as Response, nextFunction)
		expect(mockResponse.sendStatus).toBeCalledWith(404)
	})

	// TODO: 403 if !isAdmin
	// Verify it calls next() if admin
	// Requires mocking config.enable_admin
})
