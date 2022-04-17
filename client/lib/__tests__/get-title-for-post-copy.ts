// examples:
// Title --> Title 1
// Title 1 --> Title 2
// Title 2 --> Title 3
// My Title 12 huh -> My Title 12 huh 1

import getTitleForPostCopy from "@lib/get-title-for-post-copy";

describe("getTitleForPostCopy", () => {
    it("should add a number if no number is present", () => {
        expect(getTitleForPostCopy("Title")).toBe("Title 1");
    });

    it("should increment the number if present", () => {
        expect(getTitleForPostCopy("Title 1")).toBe("Title 2");
    });

    it("should ignore numbers not at the end of the title", () => {
        expect(getTitleForPostCopy("My Title 12 words")).toBe("My Title 12 words 1");
    });
})
