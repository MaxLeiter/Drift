import { timeAgo } from "@lib/time-ago";

describe("timeAgo", () => {
    it("should return '1 second ago' for 1 second ago", () => {
        expect(timeAgo(new Date(Date.now() - 1000))).toBe("1 second ago");
    });

    it("should handle negative values", () => {
        expect(timeAgo(new Date(Date.now() - -1000))).toBe("0 second ago");
    })
})
