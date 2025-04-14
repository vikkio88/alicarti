import { describe, test, expect } from "bun:test";
import { calculateResult } from "./logic";
import type {
  Move,
  RoundResult,
} from "@alicarti/shared/rooms/rockpaperscissor/config";

const m = (one: Move, two: Move) => ({ one, two });
const r = (
  draw: boolean,
  moves: { one: Move; two: Move },
  winner: "one" | "two" | null = null
): RoundResult => ({
  winner,
  draw,
  moves,
});

describe("Rps Logic tests", () => {
  test("check combo", () => {
    expect(calculateResult(m("rock", "rock"))).toEqual(
      r(true, m("rock", "rock"))
    );
    expect(calculateResult(m("rock", "paper"))).toEqual(
      r(false, m("rock", "paper"), "two")
    );
    expect(calculateResult(m("rock", "scissor"))).toEqual(
      r(false, m("rock", "scissor"), "one")
    );
    expect(calculateResult(m("paper", "scissor"))).toEqual(
      r(false, m("paper", "scissor"), "two")
    );
    expect(calculateResult(m("paper", "paper"))).toEqual(
      r(true, m("paper", "paper"))
    );
    expect(calculateResult(m("scissor", "scissor"))).toEqual(
      r(true, m("scissor", "scissor"))
    );
  });
});
