import { type ClientDTO } from "@alicarti/shared";
import {
  start,
  restart,
  end,
  choose,
  reveal,
  setup,
  playerJoined,
  playerLeft,
} from "./stateTransitions";
import type {
  RPSGameState,
  Move,
} from "@alicarti/shared/rooms/rockpaperscissor/config";
import { describe, expect, it, test } from "bun:test";

const baseState: RPSGameState = {
  phase: "waiting",
  clients: [],
  playersMap: { one: "p1", two: "p2" },
  reversePlayersMap: { p1: "one", p2: "two" },
  score: { one: 0, two: 0, draws: 0 },
  hasChosen: { one: false, two: false },
};

describe("RPSGame states transitions", () => {
  it("setup() correctly the room state", () => {
    const admin: ClientDTO = {
      createdAt: 0,
      name: "Admin",
      socketId: "socket123",
    };
    const initialState: RPSGameState = {
      phase: "waiting",
      clients: [],
      playersMap: { one: undefined, two: undefined },
      reversePlayersMap: {},
      hasChosen: { one: false, two: false },
      score: { one: 0, two: 0, draws: 0 },
      result: undefined,
    };

    const newState = setup(admin, initialState);

    expect(newState.playersMap.one).toBe("socket123");
    expect(newState.playersMap.two).toBeUndefined();
    expect(newState.reversePlayersMap).toEqual({ socket123: "one" });
    expect(newState.clients).toEqual([admin]);
  });
  it("start() should change phase to 'choosing'", () => {
    const newState = start(baseState);
    expect(newState.phase).toBe("choosing");
  });

  it("restart() should reset score and set phase to 'choosing'", () => {
    const modifiedState = {
      ...baseState,
      score: { one: 3, two: 2, draws: 1 },
    };
    const newState = restart(modifiedState);
    expect(newState.phase).toBe("choosing");
    expect(newState.score).toEqual({ one: 0, two: 0, draws: 0 });
  });

  it("end() should set phase to 'over' and clear result", () => {
    const modifiedState: RPSGameState = {
      ...baseState,
      result: { winner: "one", draw: false },
    };
    const newState = end(modifiedState);
    expect(newState.phase).toBe("over");
    expect(newState.result).toBeUndefined();
  });

  it("choose() should mark player as having chosen and update currentTurn", () => {
    const currentTurn = { one: undefined, two: undefined };
    const [newState, newTurn] = choose(baseState, currentTurn, "p1", {
      move: "rock",
    });
    expect(newState.hasChosen.one).toBe(true);
    expect(newTurn.one).toBe("rock");
    expect(newState.hasChosen.two).toBe(false);
  });

  it("reveal() should calculate result and update score", () => {
    const currentTurn = { one: "rock" as Move, two: "scissor" as Move };
    const [updatedState, updatedTurn] = reveal(
      {
        ...baseState,
        phase: "choosing",
        score: { one: 0, two: 0, draws: 0 },
        hasChosen: { one: true, two: true },
      },
      currentTurn
    );

    expect(updatedState.score.one).toBe(1);
    expect(updatedState.score.two).toBe(0);
    expect(updatedState.score.draws).toBe(0);
    expect(updatedState.phase).toBe("display");
    expect(updatedState.result?.winner).toBe("one");
    expect(updatedTurn).toEqual({ one: undefined, two: undefined });
  });

  test("joining and leaving the room", () => {
    const client1: ClientDTO = {
      name: "one",
      socketId: "1",
      createdAt: Date.now(),
    };
    const client2: ClientDTO = {
      name: "two",
      socketId: "2",
      createdAt: Date.now(),
    };
    const client3: ClientDTO = {
      name: "three",
      socketId: "3",
      createdAt: Date.now(),
    };
    const base = { ...baseState };
    let state = setup(client1, base);
    state = playerJoined(state, client2);

    expect(state.playersMap.two).toBe(client2.socketId);
    expect(state.reversePlayersMap[client2.socketId]).toBe("two");
    expect(state.clients).toHaveLength(2);
    expect(state.phase).toBe("ready");

    state = playerJoined(state, client3);
    expect(state.phase).toBe("ready");
    expect(state.playersMap.one).toBe(client1.socketId);
    expect(state.playersMap.two).toBe(client2.socketId);

    expect(state.reversePlayersMap[client1.socketId]).toBe("one");
    expect(state.reversePlayersMap[client2.socketId]).toBe("two");

    // joined 2 players and a spectator
    expect(state.reversePlayersMap[client3.socketId]).toBeUndefined();
    expect(state.clients).toHaveLength(3);

    // leave the spectator -> is still ready
    state = playerLeft(state, client3);
    expect(state.clients).toHaveLength(2);
    expect(state.phase).toBe("ready");

    // client3 rejoin the spectator -> ready
    state = playerJoined(state, client3);
    expect(state.reversePlayersMap[client3.socketId]).toBeUndefined();
    expect(state.phase).toBe("ready");

    // leaves player 2 -> not ready and client3 becomes player2
    state = playerLeft(state, client2);
    expect(state.reversePlayersMap[client3.socketId]).toBe("two");
    expect(state.clients).toHaveLength(2);
    expect(state.phase).toBe("ready");
    state = playerLeft(state, client3);
    expect(state.clients).toHaveLength(1);
    expect(state.phase).toBe("waiting");
    // admin leaves ->  client3 becomes admin (player one)
    state = playerJoined(state, client3);
    expect(state.clients).toHaveLength(2);
    state = playerLeft(state, client1);
    expect(state.clients).toHaveLength(1);
    expect(state.playersMap.one).toBe(client3.socketId);
    expect(state.phase).toBe("waiting");

    state = playerJoined(state, client1);
    expect(state.clients).toHaveLength(2);
    expect(state.phase).toBe("ready");
    expect(state.playersMap.one).toBe(client3.socketId);
    expect(state.playersMap.two).toBe(client1.socketId);
  });
  test("backfix: p2 promotion and spectator to p2", () => {
    const ogAdmin: ClientDTO = {
      name: "one",
      socketId: "1",
      createdAt: Date.now(),
    };
    const ogP2: ClientDTO = {
      name: "two",
      socketId: "2",
      createdAt: Date.now(),
    };
    const ogSpectator: ClientDTO = {
      name: "three",
      socketId: "3",
      createdAt: Date.now(),
    };

    let state = setup(ogAdmin);
    state = playerJoined(state, ogP2);
    state = playerJoined(state, ogSpectator);

    //When admin leaves
    state = playerLeft(state, ogAdmin);
    // p2 becomes admin
    expect(state.reversePlayersMap[ogP2.socketId]).toBe("one");
    // spectator becomes p2
    expect(state.reversePlayersMap[ogSpectator.socketId]).toBe("two");

    // admin leaves, spectator becomes admin
    state = playerLeft(state, ogP2);
    expect(state.reversePlayersMap[ogSpectator.socketId]).toBe("one");
    expect(state.clients).toHaveLength(1);
    expect(state.playersMap.two).toBeUndefined();
  });
});
