import byteToMB from "@lib/byte-to-mb"

describe("byteToMB", () => {
	it("converts 0 bytes to 0 MB", () => {
		expect(byteToMB(0)).toEqual(0)
	})

	it("converts 1024 bytes to 0.001 MB", () => {
		expect(byteToMB(1024)).toBeCloseTo(0.001)
	})

	it("converts 1048576 bytes to 1 MB", () => {
		expect(byteToMB(1048576)).toEqual(1)
	})

	it("converts 3145728 bytes to 3 MB", () => {
		expect(byteToMB(3145728)).toEqual(3)
	})

	it("returns NaN when given a negative number", () => {
		expect(byteToMB(-1)).toBeNaN()
	})

	it("returns NaN when given a non-numeric value", () => {
		expect(byteToMB("test" as any)).toBeNaN()
	})
})
