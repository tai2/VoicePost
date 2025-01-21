import { getRecordedFilename } from "./getRecordedFilename";

describe("getRecordedFilename", () => {
  describe("given now is 2021-01-01 01:02:03", () => {
    const now = new Date("2021-01-01T01:02:03");

    it("should return recording_20210101_010203.m4a", () => {
      expect(getRecordedFilename(now)).toBe("recording_20210101_010203.m4a");
    });
  });
});
