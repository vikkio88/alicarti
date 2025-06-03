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

{#if !isAdmin}
  <!-- This can be used to switch players and spectator in case -->
  <div class="fcc pd">
    <h2><Icon name="eye" size="24" /> Spectator</h2>
  </div>
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
  <div class="fcc mg">
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
  </div>
{/if}

{#if gameState.phase === "display"}
  <div class="frc mg">
    <button class="extra" onclick={() => connection.action(roomId, "start")}>
      Next Round
    </button>
    <button class="extra" onclick={() => connection.action(roomId, "end")}> End Game </button>
  </div>
{/if}

{#if gameState.phase === "choosing" && everyoneHasChoosen}
  <div class="f1 fcc">
    <button class="extra" onclick={() => connection.action(roomId, "reveal")}>
      Reveal
    </button>
  </div>
{/if}
