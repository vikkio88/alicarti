<script lang="ts">
  import { Commands, type WsMessage } from "@alicarti/shared";
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

  let canCreateRoom =
    connection
      .info()
      .connection?.availableCommands.find(
        (c) => c.name === Commands.CREATE_ROOM
      ) ?? false;
</script>

<div class="f r g_5 pd">
  {connection.info().connection?.socketId}
  <button class="small" onclick={disconnect}>❌</button>
</div>

<button
  disabled={!canCreateRoom}
  onclick={() => connection.command(Commands.CREATE_ROOM)}>Create Room</button
>
<div class="f rc g">
  <input type="text" bind:value={roomId} />
  <button
    disabled={roomId.length < 3}
    onclick={() => connection.command(Commands.JOIN_ROOM, { roomId })}
    >Join Room</button
  >
</div>

<style>
</style>
