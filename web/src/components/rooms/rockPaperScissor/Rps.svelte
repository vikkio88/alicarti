<script lang="ts">
  import type {
    Choose,
    Move,
    RPSActions,
    RPSGameState,
  } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import type { RoomProps } from "../props";
  import { connection } from "../../../libs/ws";
  import type { StateUpdateMessage } from "@alicarti/shared";
  import Result from "./Result.svelte";

  let { room, self, initialState }: RoomProps<RPSGameState> = $props();
  let gameState = $state(initialState);
  connection.addStateUpdater((message: StateUpdateMessage<RPSGameState>) => {
    console.log("state update", message);
    gameState = message.payload;
  });

  const choose = (move: Move) => {
    connection.action<Choose>(room.id, "choose", { move });
  };

  let isAdmin = $derived(gameState.playersMap.one === self.socketId);
  let everyoneHasChoosen = $derived(
    gameState.hasChosen.one && gameState.hasChosen.two
  );
</script>

<main class="c">
  <div class="f cc">
    {#if isAdmin}
      <div class="f cc">
        {#if gameState.phase === "ready"}
          <button onclick={() => connection.action(room.id, "start")}>
            Start
          </button>
        {/if}

        {#if gameState.phase === "display"}
          <button onclick={() => connection.action(room.id, "start")}>
            Next Round
          </button>
        {/if}

        {#if gameState.phase === "choosing" && everyoneHasChoosen}
          <button onclick={() => connection.action(room.id, "reveal")}>
            Reveal
          </button>
        {/if}
      </div>
    {/if}
    <!-- TODO: check if can stop changing after choosing or wait for reveal -->
    {#if !isAdmin && everyoneHasChoosen && gameState.phase !== "display"}
      <h1>Waiting for reveal...</h1>
    {/if}

    {#if gameState.phase === "display" && gameState.result}
      <div class="f rc">
        <Result
          self={gameState.reversePlayersMap[self.socketId]}
          score={gameState.score}
          result={gameState.result}
        />
      </div>
    {/if}

    {#if gameState.phase === "choosing" && !everyoneHasChoosen}
      <div class="f rc">
        <button onclick={() => choose("rock")}>Rock</button>
        <button onclick={() => choose("paper")}>Paper</button>
        <button onclick={() => choose("scissor")}>Scissor</button>
      </div>
    {/if}
  </div>

  <pre>{JSON.stringify(gameState, null, 2)}</pre>
</main>
