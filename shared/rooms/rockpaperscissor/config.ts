export type Phase =
  | "waiting"
  | "ready"
  | "choosing"
  | "display"
  | "resolution"
  | "over";

export type RPSGameState = {
  phase: Phase;
  playersMap: Record<"one" | "two", string | undefined>;
  reversePlayersMap: Record<string, "one" | "two">;
  score: Score;
  hasChosen: {
    one: boolean;
    two: boolean;
  };
  result?: RoundResult;
};

export type Score = {
  one: number;
  two: number;
  draws: number;
};
export type RoundResult = { winner: "one" | "two" | null; draw: boolean };

export const rpsActions = ["start", "choose", "reveal"] as const;
export type RPSActions = (typeof rpsActions)[number];

export const Rock = "rock";
export const Paper = "paper";
export const Scissor = "scissor";
export const Moves = ["rock", "paper", "scissor"];
export type Move = (typeof Moves)[number];
export type Choose = {
  move: Move;
};
