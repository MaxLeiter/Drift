import { PrismaClient } from "@prisma/client"

import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended"

import { prisma } from "@lib/server/prisma"

jest.mock("@lib/server/prisma", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>()
}))

beforeEach(() => {
	mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
