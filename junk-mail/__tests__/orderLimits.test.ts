import { DEFAULT_LIMIT } from "../constants/products";
import { applyCountDelta, getItemLimit } from "../utils/orderLimits";

describe("getItemLimit", () => {
  test("Menstrual Cup (Mini) has limit of 1", () => {
    expect(getItemLimit("Menstrual Cup (Mini)")).toBe(1);
  });

  test("Menstrual Cup (A) has limit of 1", () => {
    expect(getItemLimit("Menstrual Cup (A)")).toBe(1);
  });

  test("Menstrual Disc has limit of 1", () => {
    expect(getItemLimit("Menstrual Disc")).toBe(1);
  });

  test("Plan B has limit of 3", () => {
    expect(getItemLimit("Plan B")).toBe(3);
  });

  test("unlisted items get DEFAULT_LIMIT of 10", () => {
    expect(getItemLimit("Yellow Thin Pad")).toBe(DEFAULT_LIMIT);
    expect(DEFAULT_LIMIT).toBe(10);
  });
});

describe("applyCountDelta — increment", () => {
  test("increments count within default limit", () => {
    expect(applyCountDelta("Yellow Thin Pad", 3, +1)).toEqual({
      action: "update",
      newCount: 4,
    });
  });

  test("allows count exactly at default limit (10)", () => {
    expect(applyCountDelta("Yellow Thin Pad", 9, +1)).toEqual({
      action: "update",
      newCount: 10,
    });
  });

  test("rejects increment past default limit", () => {
    expect(applyCountDelta("Yellow Thin Pad", 10, +1)).toEqual({
      action: "reject",
    });
  });

  test("allows Plan B up to its limit of 3", () => {
    expect(applyCountDelta("Plan B", 2, +1)).toEqual({
      action: "update",
      newCount: 3,
    });
  });

  test("rejects Plan B past its limit of 3", () => {
    expect(applyCountDelta("Plan B", 3, +1)).toEqual({ action: "reject" });
  });

  test("rejects Menstrual Cup (Mini) past its limit of 1", () => {
    expect(applyCountDelta("Menstrual Cup (Mini)", 1, +1)).toEqual({
      action: "reject",
    });
  });

  test("rejects Menstrual Disc past its limit of 1", () => {
    expect(applyCountDelta("Menstrual Disc", 1, +1)).toEqual({
      action: "reject",
    });
  });
});

describe("applyCountDelta — decrement", () => {
  test("decrements count normally", () => {
    expect(applyCountDelta("Yellow Thin Pad", 5, -1)).toEqual({
      action: "update",
      newCount: 4,
    });
  });

  test("returns remove when count reaches 0", () => {
    expect(applyCountDelta("Yellow Thin Pad", 1, -1)).toEqual({
      action: "remove",
    });
  });

  test("returns remove when count goes below 0", () => {
    expect(applyCountDelta("Yellow Thin Pad", 0, -1)).toEqual({
      action: "remove",
    });
  });

  test("returns remove for Plan B when count reaches 0", () => {
    expect(applyCountDelta("Plan B", 1, -1)).toEqual({ action: "remove" });
  });
});
