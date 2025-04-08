export type Phase =
  | "waiting"
  | "ready"
  | "started"
  | "over"
  | "choosing"
  | "display"
  | "resolution";

export type RPSGameState = {
  phase: Phase;
  playersMap: Record<"one" | "two", string | undefined>;
  score: {
    one: number;
    two: number;
  };
  hasChosen: {
    one: boolean;
    two: boolean;
  };
  result?: { winner: "one" | "two"; draw: boolean };
};

export const rpsActions = ["choose"] as const;
export type RPSActions = (typeof rpsActions)[number];

export const Rock = "Rock";
export const Paper = "paper";
export const Scissor = "scissor";
export const Moves = [Rock, Paper, Scissor];
export type Choose = {
  move: (typeof Moves)[number];
};
