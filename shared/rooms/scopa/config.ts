export const scopaGamePhases = ["draw", "play", "resolve"];
export type ScopaGamePhases = (typeof scopaGamePhases)[number];

export type Card = {};

export type Deck = {};
export type Hand = {};
export type Slot = {
  card?: Card;
  index: number;
};
export type Player = {
  id: string;
  name: string;
};
export type PlayerRecord<T> = Record<"one" | "two", T>;
export type ScopaGameState = {
  players: PlayerRecord<Player>;
  turn: {
    player: keyof PlayerRecord<any>;
    phase: ScopaGamePhases;
  };
  deck: Deck;
  hands: PlayerRecord<Hand>;
  board: [Slot, Slot, Slot, Slot];
};

export type SendMessagePayload = {
  message: string;
};
