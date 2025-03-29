<script lang="ts">
  import { Commands } from "@alicarti/shared";
  import { connection } from "../libs/ws";
  import { appState } from "../store/appState.svelte";
  import Icon from "./shared/Icon.svelte";

  const disconnect = () => {
    connection.close();
    appState.disconnected();
  };
</script>

<div class="top">
  <div>
    {#if appState.roomId}
      <button
        class="small"
        onclick={() => {
          connection.command(Commands.LEAVE_ROOM, { roomId: appState.roomId });
          appState.leftRoom();
        }}
      >
        <Icon name="exit" />
      </button>
      {appState.roomId}
    {/if}
  </div>

  <div>
    {#if appState.socketId}
      {appState.socketId}
      <button class="small" onclick={disconnect}>
        <Icon name="disconnect" />
      </button>
    {/if}
  </div>
</div>

<style>
  .top {
    position: absolute;
    top: 0;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .top > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .top button {
    /* padding: 0; */
  }
</style>
