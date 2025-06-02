<script lang="ts">
  import type { RPSGameState } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import { connection } from "../../../libs/ws";
  import Clients from "./Clients.svelte";
  import Icon from "../../shared/Icon.svelte";

  type Props = {
    isAdmin: boolean;
    gameState: RPSGameState;
    roomId: string;
    everyoneHasChoosen: boolean;
    selfId: string;
  };
  let { gameState, roomId, everyoneHasChoosen, isAdmin, selfId }: Props =
    $props();

  let startHeader = $derived(
    gameState.phase === "over" ? "Restart Game" : "Start Game"
  );
</script>

<div class="f cc mg">
  {#if !isAdmin}
    <!-- This can be used to switch players and spectator in case -->
    <h2><Icon name="eye" size="24" /> Spectator</h2>
  {/if}

  {#if gameState.phase === "ready" || gameState.phase === "waiting"}
    <Clients
      {selfId}
      {roomId}
      clients={gameState.clients}
      reversePlayersMap={gameState.reversePlayersMap}
      playersMap={gameState.playersMap}
      {isAdmin}
    />
  {/if}
  {#if gameState.phase === "ready" || gameState.phase === "over"}
    <button
    class="extra"
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
    <button class="extra" onclick={() => connection.action(roomId, "reveal")}>
      Reveal
    </button>
  {/if}
</div>
