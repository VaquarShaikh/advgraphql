import sum from "./sum";
import { describe, expect, test } from "@jest/globals";

test("adds 1 + 2 to 3", () => {
  expect(sum(1, 2)).toBe(3);
});
