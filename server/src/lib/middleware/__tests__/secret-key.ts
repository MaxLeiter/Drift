// import * as request from 'supertest'
// import { app } from '../../../app'
import { NextFunction, Response } from "express"
import { UserJwtRequest } from "@lib/middleware/jwt"
import secretKey from "@lib/middleware/secret-key"
import config from "@lib/config"

describe("secret-key middlware", () => {
	let mockRequest: Partial<UserJwtRequest>
	let mockResponse: Partial<Response>
	let nextFunction: NextFunction = jest.fn()

	beforeEach(() => {
		mockRequest = {}
		mockResponse = {
			sendStatus: jest.fn()
		}
	})

	it("should return 401 if no x-secret-key header", async () => {
		const res = mockResponse as Response
		secretKey(mockRequest as UserJwtRequest, res, nextFunction)
		expect(res.sendStatus).toHaveBeenCalledWith(401)
	})

	it("should return 401 if x-secret-key does not match server", async () => {
		const defaultSecretKey = config.secret_key
		const req = mockRequest as UserJwtRequest
		req.headers = {
			authorization: "Bearer",
			"x-secret-key": defaultSecretKey + "1"
		}
		secretKey(req, mockResponse as Response, nextFunction)
		expect(mockResponse.sendStatus).toBeCalledWith(401)
	})

	it("should call next() if x-secret-key matches server", async () => {
		const req = mockRequest as UserJwtRequest
		req.headers = {
			authorization: "Bearer",
			"x-secret-key": config.secret_key
		}
		secretKey(req, mockResponse as Response, nextFunction)
		expect(nextFunction).toBeCalled()
	})
})
