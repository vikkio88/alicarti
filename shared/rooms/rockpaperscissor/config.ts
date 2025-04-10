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

export const rpsActions = ["start", "choose"] as const;
export type RPSActions = (typeof rpsActions)[number];

export const Rock = "rock";
export const Paper = "paper";
export const Scissor = "scissor";
export const Moves = ["rock", "paper", "scissor"];
export type Move = (typeof Moves)[number];
export type Choose = {
  move: Move;
};
