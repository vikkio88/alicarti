import type { ClientDTO } from "../../Client";

export type Phase =
  | "waiting"
  | "ready"
  | "choosing"
  | "display"
  | "resolution"
  | "over";

export type RPSGameState = {
  phase: Phase;
  clients: ClientDTO[],
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
export type RoundResult = {
  winner: "one" | "two" | null;
  draw: boolean;
  moves?: { one: Move; two: Move };
};

export const rpsActions = [
  "start",
  "restart",
  "assignRole",
  "choose",
  "reveal",
  "end",
] as const;
export type RPSActions = (typeof rpsActions)[number];

export const Rock = "rock";
export const Paper = "paper";
export const Scissor = "scissor";
export const Moves = ["rock", "paper", "scissor"];
export type Move = "rock" | "paper" | "scissor";
export type Choose = {
  move: Move;
};
export type AssignedRole = {
  clientId: string;
  role: "spectator" | "playerTwo";
};
