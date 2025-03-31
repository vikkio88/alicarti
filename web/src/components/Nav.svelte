<script lang="ts">
  import { Commands } from "@alicarti/shared";
  import { connection } from "../libs/ws";
  import { ws } from "../store/wsState.svelte";
  import Icon from "./shared/Icon.svelte";

  const disconnect = () => {
    connection.close();
    ws.disconnected();
  };
</script>

<div class="top" class:withItems={Boolean(ws.socketId)}>
  <div>
    {#if ws.roomId}
      <button
        class="small"
        onclick={() => {
          connection.command(Commands.LEAVE_ROOM, { roomId: ws.roomId });
        }}
      >
        <Icon name="exit" />
      </button>
      {ws.roomId}
    {/if}
  </div>

  <div>
    {#if ws.socketId}
      {ws.socketId}
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
    padding: 1rem;
  }

  .withItems {
    border-bottom: var(--borders);
    border-color: var(--main-bg-faint-color);
    background-color: var(--main-bg-faint-color);
  }

  .top > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
