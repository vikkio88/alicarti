<script lang="ts">
  import { Commands } from "@alicarti/shared";
  import { connection } from "../libs/ws";
  import { ws } from "../store/wsState.svelte";
  import Icon from "./shared/Icon.svelte";
  import { copyToClipboard } from "../libs/clipboard";
  import { uiState } from "../store/ui.svelte";

  const disconnect = () => {
    connection.close();
    ws.disconnected();
  };

  let showName = $state(true);
</script>

<nav class="f r spb pd">
  {#if ws.roomId}
    <div>
      <button
        onclick={() => {
          connection.command(Commands.LEAVE_ROOM, { roomId: ws.roomId });
        }}
      >
        <div class="tooltip bottom">Leave Room</div>
        <Icon name="exit" />
      </button>
      <button
        class="border small-round"
        onclick={() =>
          copyToClipboard(ws.roomId ?? "", () =>
            uiState.snackMessage("Copied to Clipboard")
          )}
      >
        {ws.roomId}
        <div class="tooltip bottom">Room Id</div>
      </button>
    </div>
  {/if}

  <div>
    {#if ws.socketId}
      <button class="border small-round" onclick={() => (showName = !showName)}>
        {#if showName}
          {ws.displayName}
        {:else}
          {ws.socketId}
        {/if}
        <div class="tooltip bottom">Client Id</div>
      </button>
      <button class="small" onclick={disconnect}>
        <Icon name="disconnect" />
        <div class="tooltip bottom">Disconnect</div>
      </button>
    {/if}
  </div>
</nav>

<style>
  @media (max-width: 600px) {
    nav {
      display: flex;
      flex-direction: column-reverse;
      padding: 0;
    }
  }
</style>
