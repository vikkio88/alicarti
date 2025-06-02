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

<main class="responsive rps">
  <div>
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

    <article class="middle-align center-align medium">
      {#if gameState.phase === "waiting"}
        <div>
          <h1>Waiting for one more player...</h1>
          <Spinner />
        </div>
      {/if}

      {#if gameState.phase === "ready"}
        {#if !isAdmin && isPlayer}
          <h2>
            <RpsIcon name="two" size="24" />
            Player Two
          </h2>
        {/if}
        <h1>Ready!</h1>
        <Spinner />
      {/if}

      {#if !isAdmin && everyoneHasChoosen && gameState.phase !== "display"}
        <h1>Waiting for reveal...</h1>
        <Spinner />
      {/if}

      {#if gameState.phase === "display" || gameState.phase === "over" || !isPlayer}
        <div class="f rc">
          <Result
            {isPlayer}
            self={gameState.reversePlayersMap[self.socketId]}
            score={gameState.score}
            result={gameState.result}
            phase={gameState.phase}
          />
        </div>
      {/if}

      {#if isPlayer && gameState.phase === "choosing" && !everyoneHasChoosen}
        <div class="f rc g_5">
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
      {/if}
      <div>
        {#if (hasOneChoosen || hasTwoChoosen) && !everyoneHasChoosen}
          {#if isAdmin && hasTwoChoosen}
            <h2>Player two has choosen</h2>
          {:else if !isAdmin && hasOneChoosen}
            <h2>Player one has choosen</h2>
          {/if}
        {/if}
      </div>
    </article>
  </div>
</main>

<style>
  .rps {
    display: flex;
  }

  .clients {
    flex: 4;
  }

  .roomInfo {
    flex: 1;
  }

  .gameState {
    flex: 8;
  }
</style>
