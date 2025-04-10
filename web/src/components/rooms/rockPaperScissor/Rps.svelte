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
  <pre>{JSON.stringify(gameState, null, 2)}</pre>

  <div class="f cc">
    {#if isAdmin}
      {#if gameState.phase === "ready"}
        <button onclick={() => connection.action(room.id, "start")}>
          Start
        </button>
      {/if}
      {#if gameState.phase === "choosing" && everyoneHasChoosen}
        <button onclick={() => console.log("reveal")}>Reveal</button>
      {/if}
    {/if}
    <!-- TODO: check if can stop changing after choosing or wait for reveal -->
    {#if gameState.phase === "choosing"}
      <button onclick={() => choose("rock")}>Rock</button>
      <button onclick={() => choose("paper")}>Paper</button>
      <button onclick={() => choose("scissor")}>Scissor</button>
    {/if}
  </div>
</main>
