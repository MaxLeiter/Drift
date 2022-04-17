// const byteToMB = (bytes: number) =>
// 	Math.round((bytes / 1024 / 1024) * 100) / 100

import formatBytes from "@lib/format-bytes"

describe("formatBytes", () => {
    it("should return 0 Bytes", () => {
        expect(formatBytes(0)).toBe("0 Bytes")
    })

    it("should return 512 Bytes", () => {
        expect(formatBytes(512)).toBe("512 Bytes")
    })

    it("should return 1 KB", () => {
        expect(formatBytes(1024)).toBe("1 KB")
    })

    it("should return 1 MB", () => {
        expect(formatBytes(1024 * 1024)).toBe("1 MB")
    })

    it("should return 1 GB", () => {
        expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB")
    })

    it("should return 256 GB", () => {
        expect(formatBytes(1024 * 1024 * 1024 * 256)).toBe("256 GB")
    })

    it("should return 1 TB", () => {
        expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe("1 TB")
    })
})
