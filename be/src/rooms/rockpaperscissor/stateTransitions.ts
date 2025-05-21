import type {
  Choose,
  Phase,
  RPSGameState,
} from "@alicarti/shared/rooms/rockpaperscissor/config";
import type { CurrentTurn } from ".";
import { calculateResult } from "./logic";
import type { ClientDTO } from "@alicarti/shared";

export const initialState = (playerOne: string): RPSGameState => ({
  phase: "waiting" as Phase,
  clients: [],
  playersMap: {
    one: playerOne,
    two: undefined,
  },
  reversePlayersMap: {},
  score: {
    one: 0,
    two: 0,
    draws: 0,
  },
  hasChosen: {
    one: false,
    two: false,
  },
});

export function setup(
  admin: ClientDTO,
  state = initialState("")
): RPSGameState {
  return {
    ...state,
    playersMap: {
      one: admin.socketId,
      two: undefined,
    },
    reversePlayersMap: {
      [admin.socketId]: "one",
    },
    clients: [admin],
  };
}

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

export function playerJoined(
  state: RPSGameState,
  client: ClientDTO
): RPSGameState {
  const clients = [...state.clients, client];

  if (state.playersMap.two) {
    return { ...state, clients };
  }

  state.playersMap.two = client.socketId;
  state.reversePlayersMap[client.socketId] = "two";
  const enoughToPlay =
    Object.values(state.reversePlayersMap).filter(Boolean).length === 2;
  return {
    ...state,
    playersMap: {
      ...state.playersMap,
      two: client.socketId,
    },
    reversePlayersMap: {
      ...state.reversePlayersMap,
      [client.socketId]: "two",
    },
    clients,
    phase: enoughToPlay ? "ready" : "waiting",
  };
}

const n = (id: string) => (c: ClientDTO) => c.socketId != id;

export function playerLeft(
  state: RPSGameState,
  client: ClientDTO
): RPSGameState {
  const leaverId = client.socketId;
  const clients = state.clients.filter(n(leaverId));
  // if spectator leaves the game phase should not change
  if (!state.reversePlayersMap[leaverId]) {
    return {
      ...state,
      clients,
    };
  }

  const leavingPlayer = state.playersMap.one === leaverId ? "one" : "two";

  if (leavingPlayer === "two") {
    const hasOtherClient = clients.find(
      (c) => c.socketId != leaverId && c.socketId != state.playersMap.one
    );

    const reversePlayersMap: Record<string, "one" | "two"> = {
      [state.playersMap.one!]: "one",
    };
    if (hasOtherClient) {
      reversePlayersMap[hasOtherClient.socketId] = "two";
    }

    return {
      ...state,
      playersMap: {
        ...state.playersMap,
        two: hasOtherClient ? hasOtherClient.socketId : undefined,
      },
      reversePlayersMap,
      clients,
      // if a player leaves the phase could change
      phase: hasOtherClient ? "ready" : "waiting",
    };
  }

  // if is the admin the one leaving
  //TODO: this also needs to check if spectator was there and make it a player 2
  if (leavingPlayer === "one") {
    const remainingClients = clients.filter((c) => c.socketId !== leaverId);

    const newPlayersMap: typeof state.playersMap = {
      one: undefined,
      two: undefined,
    };
    const reversePlayersMap: Record<string, "one" | "two"> = {};

    const oldP2Id = state.playersMap.two;

    const isP2StillPresent = oldP2Id && oldP2Id !== leaverId;
    const newAdmin = isP2StillPresent
      ? remainingClients.find((c) => c.socketId === oldP2Id)
      : remainingClients[0];

    if (newAdmin) {
      newPlayersMap.one = newAdmin.socketId;
      reversePlayersMap[newAdmin.socketId] = "one";
    }

    const newP2 = remainingClients.find(
      (c) =>
        c.socketId !== leaverId &&
        c.socketId !== newPlayersMap.one &&
        c.socketId !== oldP2Id
    );

    if (newP2) {
      newPlayersMap.two = newP2.socketId;
      reversePlayersMap[newP2.socketId] = "two";
    }

    return {
      ...state,
      playersMap: newPlayersMap,
      reversePlayersMap,
      clients,
      phase:
        Object.values(newPlayersMap).filter(Boolean).length === 2
          ? "ready"
          : "waiting",
    };
  }

  // this should never happen
  return state;
}
