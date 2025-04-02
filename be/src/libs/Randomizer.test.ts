import { describe, expect, it } from "bun:test";
import { Randomizer } from "./Randomizer";

describe("Randomizer", () => {
  it("should generate consistent random numbers with the same seed", () => {
    const rand1 = new Randomizer(42);
    const rand2 = new Randomizer(42);
    
    expect(rand1.random()).toBe(rand2.random());
    expect(rand1.random()).toBe(rand2.random());
  });

  it("should return an integer within a range", () => {
    const rand = new Randomizer(123);
    const value = rand.int(1, 10);
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(10);
  });

  it("should pick one element from an array", () => {
    const rand = new Randomizer(5);
    const array = ["apple", "banana", "cherry"];
    expect(array).toContain(rand.pickOne(array));
  });

  it("should pick multiple elements from an array", () => {
    const rand = new Randomizer(10);
    const array = ["apple", "banana", "cherry", "date", "fig", "grape"];
    const picked = rand.pickSome(array, 3);
    expect(picked.length).toBe(3);
    picked.forEach(item => expect(array).toContain(item));
  });

  it("should return a boolean based on chance", () => {
    const rand = new Randomizer(100);
    expect(typeof rand.chance(50)).toBe("boolean");
  });
});
