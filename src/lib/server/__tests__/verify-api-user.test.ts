import { verifyApiUser } from "../verify-api-user"
import { prismaMock } from "src/test/prisma.mock"
import "src/test/react.mock"
import { User } from "@prisma/client"

describe("verifyApiUser", () => {
	const mockReq = {} as any
	const mockRes = {} as any

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("returns null if there is no userId param or auth token", async () => {
		mockReq.query = {}
		mockReq.headers = {}
		const result = await verifyApiUser(mockReq, mockRes)
		expect(result).toBeNull()
	})

	it("returns the user id if there is a userId param and it matches the authenticated user id", async () => {
		mockReq.query = { userId: "123" }
		const mockUser = { id: "123" }
		const mockGetCurrentUser = prismaMock.user.findUnique.mockResolvedValue(
			mockUser as User
		)
		const result = await verifyApiUser(mockReq, mockRes)
		expect(mockGetCurrentUser).toHaveBeenCalled()
		expect(result).toEqual("123")
	})

	it("returns null if there is a userId param but it doesn't match the authenticated user id", async () => {
		mockReq.query = { userId: "123" }
		const mockUser = { id: "456" }
		const mockGetCurrentUser = jest.fn().mockResolvedValue(mockUser)
		const result = await verifyApiUser(mockReq, mockRes)
		expect(mockGetCurrentUser).toHaveBeenCalled()
		expect(result).toBeNull()
	})

	it("returns the user id if there is an auth token and it is valid", async () => {
		mockReq.query = {}
		mockReq.headers.authorization = "Bearer mytoken"
		const mockUser = { userId: "123", expiresAt: new Date(Date.now() + 10000) }
		const mockFindUnique = jest.fn().mockResolvedValue(mockUser)
		const mockPrisma = { apiToken: { findUnique: mockFindUnique } } as any
		const result = await verifyApiUser(mockReq, mockRes)
		expect(mockFindUnique).toHaveBeenCalledWith({
			where: { token: "mytoken" },
			select: { userId: true, expiresAt: true }
		})
		expect(result).toEqual("123")
	})
})
