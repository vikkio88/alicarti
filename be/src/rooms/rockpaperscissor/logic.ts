import type {
  Move,
  RoundResult,
} from "@alicarti/shared/rooms/rockpaperscissor/config";

const movesMatrix: Record<Move, Record<Move, -1 | 0 | 1>> = {
  rock: { rock: 0, paper: -1, scissor: 1 },
  paper: { rock: 1, paper: 0, scissor: -1 },
  scissor: { rock: -1, paper: 1, scissor: 0 },
};

export function calculateResult(currentTurn: {
  one?: Move;
  two?: Move;
}): RoundResult {
  if (!currentTurn.one || !currentTurn.two) {
    return { winner: "one", draw: true };
  }

  const { one, two } = currentTurn;

  const draw = movesMatrix[one][two] === 0;
  const winnerOne = movesMatrix[one][two] === 1;
  return {
    winner: draw ? null : winnerOne ? "one" : "two",
    draw,
    moves: { one, two },
  };
}
