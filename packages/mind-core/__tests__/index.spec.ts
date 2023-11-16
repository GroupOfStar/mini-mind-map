import { sum } from "./../src/index";

describe("test", () => {
  it("should return a ref", () => {
    expect(sum(2, 3)).toBe(5);
  });
});
