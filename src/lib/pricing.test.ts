import { describe, expect, it } from "vitest";
import { lineTotal, shippingFor, unitPrice } from "./pricing";

describe("pricing", () => {
  it("100 adet uses full base price", () => {
    expect(unitPrice(20, 100)).toBe(20);
  });
  it("1000 adet gets 22% discount per piece", () => {
    expect(unitPrice(20, 1000)).toBe(15.6);
  });
  it("extras add per-piece cost", () => {
    expect(lineTotal(20, 250, ["waxSeal", "ribbon"])).toBe(250 * (18.4 + 7));
  });
  it("free shipping at 2500 TL and above", () => {
    expect(shippingFor(2500)).toBe(0);
    expect(shippingFor(2499)).toBe(149);
  });
});
