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
  import MoveIcon from "./MoveIcon.svelte";
  import AdminPanel from "./AdminPanel.svelte";
  import Spinner from "./Spinner.svelte";
  import RoomInfo from "../../shared/RoomInfo.svelte";
  import RpsIcon from "./RpsIcon.svelte";

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
  let hasOneChoosen = $derived(gameState.hasChosen.one);
  let hasTwoChoosen = $derived(gameState.hasChosen.two);
  let everyoneHasChoosen = $derived(hasOneChoosen && hasTwoChoosen);
</script>

<main class="responsive f c">
  {#if isAdmin || !isPlayer}
    <AdminPanel
      {gameState}
      {everyoneHasChoosen}
      roomId={room.id}
      {isAdmin}
      selfId={self.socketId}
    />
  {/if}

  {#if gameState.phase === "waiting"}
    <RoomInfo {room} />
  {/if}

  {#if gameState.phase === "waiting"}
    <div class="f1 fcc mg pd">
      <h2>Waiting for one more player...</h2>
      <Spinner />
    </div>
  {/if}

  {#if gameState.phase === "ready"}
    <div class="f1 fcc">
      {#if !isAdmin && isPlayer}
        <h2>
          <RpsIcon name="two" size="24" />
          Player Two
        </h2>
      {/if}
      <h1>Ready!</h1>
      <Spinner />
    </div>
  {/if}

  {#if !isAdmin && everyoneHasChoosen && gameState.phase !== "display"}
    <div class="f1 fcc">
      <h1>Waiting for reveal...</h1>
      <Spinner />
    </div>
  {/if}

  {#if gameState.phase === "display" || gameState.phase === "over" || !isPlayer}
    <Result
      {isPlayer}
      self={gameState.reversePlayersMap[self.socketId]}
      score={gameState.score}
      result={gameState.result}
      phase={gameState.phase}
    />
  {/if}

  {#if gameState.phase === "choosing" && !everyoneHasChoosen}
    {#if isPlayer}
      <div class="f1 frc g">
        <div class="frc g_5">
          <button onclick={() => choose("rock")}>
            <MoveIcon move={"rock"} />
          </button>
          <button onclick={() => choose("paper")}>
            <MoveIcon move={"paper"} />
          </button>
          <button onclick={() => choose("scissor")}>
            <MoveIcon move={"scissor"} />
          </button>
        </div>
      </div>
    {/if}
    <div class="frc">
      {#if (hasOneChoosen || hasTwoChoosen) && !everyoneHasChoosen}
        {#if isAdmin && hasTwoChoosen}
          <h2>Player two has choosen</h2>
        {:else if !isAdmin && hasOneChoosen}
          <h2>Player one has choosen</h2>
        {/if}
      {/if}
    </div>
  {/if}
</main>
