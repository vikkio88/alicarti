import type {
  Choose,
  RPSGameState,
} from "@alicarti/shared/rooms/rockpaperscissor/config";
import type { CurrentTurn } from ".";
import { calculateResult } from "./logic";

export function start(state: RPSGameState): RPSGameState {
  return {
    ...state,
    phase: "choosing",
  };
}

// this is to reset the score on Start Over
export function restart(state: RPSGameState): RPSGameState {
  return {
    ...start(state),
    score: { one: 0, two: 0, draws: 0 },
  };
}

export function end(state: RPSGameState): RPSGameState {
  return {
    ...state,
    phase: "over",
    result: undefined,
  };
}

export function choose(
  state: RPSGameState,
  currentTurn: CurrentTurn,
  chooserId: string,
  data: Choose
): [RPSGameState, CurrentTurn] {
  const player = state.playersMap.one === chooserId ? "one" : "two";
  return [
    { ...state, hasChosen: { ...state.hasChosen, [player]: true } },
    { ...currentTurn, [player]: data.move },
  ];
}

export function reveal(
  state: RPSGameState,
  currentTurn: CurrentTurn
): [RPSGameState, CurrentTurn] {
  const result = calculateResult(currentTurn);
  if (!result.draw) {
    state.score[result.winner!] += 1;
  } else {
    state.score.draws += 1;
  }

  state.result = result;
  state.phase = "display";
  currentTurn = { one: undefined, two: undefined };
  state.hasChosen = { one: false, two: false };
  return [{ ...state }, { ...currentTurn }];
}
