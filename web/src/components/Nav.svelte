<script lang="ts">
  import { Commands } from "@alicarti/shared";
  import { connection } from "../libs/ws";
  import { appState } from "../store/appState.svelte";

  const disconnect = () => {
    connection.close();
    appState.disconnected();
  };
</script>

{#if appState.roomId}
  <div class="topLeft">
    <button
      onclick={() => {
        connection.command(Commands.LEAVE_ROOM, { roomId: appState.roomId });
        appState.leftRoom();
      }}
    >
      Leave
    </button>
  </div>
{/if}

{#if appState.socketId}
  <div class="topBar">
    {appState.socketId}
    <button class="small" onclick={disconnect}>❌</button>
  </div>
{/if}

<style>
  .topBar {
    position: absolute;
    top: 0;
    right: 0;
  }

  .topLeft {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
