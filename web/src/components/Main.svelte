<script lang="ts">
  import type { WsMessage } from "@alicarti/shared";
  import { connection } from "../libs/ws";
  type Props = {
    onClose: () => void;
  };

  let { onClose }: Props = $props();

  connection.addMessageHandler((message: WsMessage<{ loggedIn: number }>) => {
    if (message.type === "state_update") {
      console.log({ message });
    }

    if (message.type === "command_result") {
      console.log({ message });
    }
  });
  const disconnect = () => {
    connection.close();
    onClose();
  };

  let roomId: string = $state("");
</script>

<div class="f r g_5 pd">
  {connection.info().connection?.socketId}
  <button class="small" onclick={disconnect}>❌</button>
</div>
<ul>
  {#each connection.info().connection?.availableCommands ?? [] as cmd}
    <li>
      <button onclick={() => connection.command(cmd.name)}>
        {cmd.description}
      </button>
    </li>
  {:else}
    <h2>No Commands</h2>
  {/each}
</ul>
<div class="f rc g">
  <input type="text" bind:value={roomId} />
  <button disabled={roomId.length < 3}>Join Room</button>
</div>

<style>
  ul {
    list-style: none;
  }
</style>
