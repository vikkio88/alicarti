<script lang="ts">
  import type { RPSGameState } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import { connection } from "../../../libs/ws";

  type Props = {
    gameState: RPSGameState;
    roomId: string;
    everyoneHasChoosen: boolean;
  };
  let { gameState, roomId, everyoneHasChoosen }: Props = $props();

  let startHeader = $derived(
    gameState.phase === "over" ? "Start Over" : "Start"
  );
</script>

<div class="f cc mg">
  {#if gameState.phase === "ready" || gameState.phase === "over"}
    <button
      onclick={() =>
        connection.action(
          roomId,
          gameState.phase === "over" ? "restart" : "start"
        )}
    >
      {startHeader}
    </button>
  {/if}

  {#if gameState.phase === "display"}
    <div class="f rc">
      <button onclick={() => connection.action(roomId, "start")}>
        Next Round
      </button>
      <button onclick={() => connection.action(roomId, "end")}>
        End Game
      </button>
    </div>
  {/if}

  {#if gameState.phase === "choosing" && everyoneHasChoosen}
    <button onclick={() => connection.action(roomId, "reveal")}>
      Reveal
    </button>
  {/if}
</div>
