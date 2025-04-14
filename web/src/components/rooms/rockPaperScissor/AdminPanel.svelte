<script lang="ts">
  import type { RPSGameState } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import { connection } from "../../../libs/ws";
  import type { Room } from "@alicarti/shared/rooms";

  type Props = {
    gameState: RPSGameState;
    roomId: string;
    everyoneHasChoosen: boolean;
  };
  let { gameState, roomId, everyoneHasChoosen }: Props = $props();
</script>

<div class="f cc">
  {#if gameState.phase === "ready" || gameState.phase === "over"}
    <button onclick={() => connection.action(roomId, "start")}>
      Start Game
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
