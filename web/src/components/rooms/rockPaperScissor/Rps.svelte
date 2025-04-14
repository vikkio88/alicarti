<script lang="ts">
  import type {
    Choose,
    Move,
    RPSGameState,
  } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import type { RoomProps } from "../props";
  import { connection } from "../../../libs/ws";
  import type { StateUpdateMessage } from "@alicarti/shared";
  import Result from "./Result.svelte";
  import RPSIcon from "./Icon.svelte";
  import AdminPanel from "./AdminPanel.svelte";
  import Spinner from "./Spinner.svelte";

  let { room, self, initialState }: RoomProps<RPSGameState> = $props();
  let gameState = $state(initialState);
  connection.addStateUpdater((message: StateUpdateMessage<RPSGameState>) => {
    gameState = message.payload;
  });

  const choose = (move: Move) => {
    connection.action<Choose>(room.id, "choose", { move });
  };

  let isPlayer = $derived(
    Object.keys(gameState.reversePlayersMap).includes(self.socketId)
  );

  let isAdmin = $derived(gameState.playersMap.one === self.socketId);
  let everyoneHasChoosen = $derived(
    gameState.hasChosen.one && gameState.hasChosen.two
  );
</script>

<main class="c">
  <div class="f1 f cc">
    <!-- TODO: add copiable link to room in case you are waiting -->
    {#if isAdmin}
      <AdminPanel {gameState} {everyoneHasChoosen} roomId={room.id} />
    {/if}

    {#if gameState.phase === "waiting"}
      <h1>Waiting for the right number of players...</h1>
      <Spinner />
    {/if}

    {#if gameState.phase === "ready"}
      <h1>Ready!</h1>
      <Spinner />
    {/if}

    {#if !isAdmin && everyoneHasChoosen && gameState.phase !== "display"}
      <h1>Waiting for reveal...</h1>
      <Spinner />
    {/if}

    {#if gameState.phase === "display" || gameState.phase === "over"}
      <div class="f rc">
        <Result
          self={gameState.reversePlayersMap[self.socketId]}
          score={gameState.score}
          result={gameState.result}
        />
      </div>
    {/if}

    {#if isPlayer && gameState.phase === "choosing" && !everyoneHasChoosen}
      <div class="f rc g_5">
        <button onclick={() => choose("rock")}>
          <RPSIcon move={"rock"} />
        </button>
        <button onclick={() => choose("paper")}>
          <RPSIcon move={"paper"} />
        </button>
        <button onclick={() => choose("scissor")}>
          <RPSIcon move={"scissor"} />
        </button>
      </div>
    {/if}
  </div>

  <!-- <pre>{JSON.stringify(gameState, null, 2)}</pre> -->
</main>
