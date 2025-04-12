import { describe, test, expect } from "bun:test";
import { calculateResult } from "./logic";
import type {
  Move,
  RoundResult,
} from "@alicarti/shared/rooms/rockpaperscissor/config";

const m = (one: Move, two: Move) => ({ one, two });
const r = (
  draw: boolean,
  winner: "one" | "two" | null = null
): RoundResult => ({
  winner,
  draw,
});

describe("Rps Logic tests", () => {
  test("check combo", () => {
    expect(calculateResult(m("rock", "rock"))).toEqual(r(true));
    expect(calculateResult(m("rock", "paper"))).toEqual(r(false, "two"));
    expect(calculateResult(m("rock", "scissor"))).toEqual(r(false, "one"));
    expect(calculateResult(m("paper", "scissor"))).toEqual(r(false, "two"));
    expect(calculateResult(m("paper", "paper"))).toEqual(r(true));
    expect(calculateResult(m("scissor", "scissor"))).toEqual(r(true));
  });
});
