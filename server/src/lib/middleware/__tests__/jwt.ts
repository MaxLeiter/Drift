import jwt, { UserJwtRequest } from "@lib/middleware/jwt"
import { NextFunction, Response } from "express"

describe("jwt middlware", () => {
    let mockRequest: Partial<UserJwtRequest>
    let mockResponse: Partial<Response>
    let nextFunction: NextFunction = jest.fn()

    beforeEach(() => {
        mockRequest = {}
        mockResponse = {
            sendStatus: jest.fn().mockReturnThis(),
        }
    })

    it("should return 401 if no authorization header", () => {
        const res = mockResponse as Response
        jwt(mockRequest as UserJwtRequest, res, nextFunction)
        expect(res.sendStatus).toHaveBeenCalledWith(401)
    })

    it("should return 401 if no token is supplied", () => {
        const req = mockRequest as UserJwtRequest
        req.headers = {
            authorization: "Bearer"
        }
        jwt(req, mockResponse as Response, nextFunction)
        expect(mockResponse.sendStatus).toBeCalledWith(401)
    })

    // it("should return 401 if token is deleted", async () => {
    //     try {
    //         const tokenString = "123"

    //         const req = mockRequest as UserJwtRequest
    //         req.headers = {
    //             authorization: `Bearer ${tokenString}`
    //         }
    //         jwt(req, mockResponse as Response, nextFunction)
    //         expect(mockResponse.sendStatus).toBeCalledWith(401)
    //         expect(mockResponse.json).toBeCalledWith({
    //             message: "Token is no longer valid"
    //         })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // })
})