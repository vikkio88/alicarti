<script lang="ts">
  import {
    Commands,
    type CommandPayload,
    type WsMessage,
  } from "@alicarti/shared";
  import {
    RoomTypes,
    type Room as JoinedRoom,
    type RoomType,
  } from "@alicarti/shared/rooms";

  import { connection } from "../libs/ws";
  import { canCreateRoom as check } from "../libs/utils";
  import Room from "./Room.svelte";
  type Props = {
    onClose: () => void;
  };

  let { onClose }: Props = $props();

  connection.addMessageHandler((message: WsMessage<any>) => {
    if (message.type === "command_result") {
      const commandResult = message.payload as CommandPayload<any>;
      switch (commandResult.command) {
        case Commands.JOIN_ROOM:
        case Commands.CREATE_ROOM: {
          if (commandResult.success) {
            joinedRoom = {
              id: commandResult.data.id,
              type: commandResult.data.type as RoomType,
            };
          }
          break;
        }
        case Commands.LEAVE_ROOM: {
          if (commandResult.success) {
            joinedRoom = null;
          }
        }
      }
    }
  });
  const disconnect = () => {
    connection.close();
    onClose();
  };

  let joinedRoom: JoinedRoom | null = $state(null);
  let roomId: string = $state("");
  let canCreateRoom = check(connection.info().connection);
</script>

<div class="f r g_5 pd">
  {connection.info().connection?.socketId}
  <button class="small" onclick={disconnect}>❌</button>
</div>

{#if !joinedRoom}
  <button
    disabled={!canCreateRoom}
    onclick={() =>
      connection.command(Commands.CREATE_ROOM, { roomType: RoomTypes.echo })}
  >
    Create Room
  </button>
  <div class="f rc g">
    <input type="text" bind:value={roomId} />
    <button
      disabled={roomId.length < 3}
      onclick={() => connection.command(Commands.JOIN_ROOM, { roomId })}
    >
      Join Room
    </button>
  </div>
{:else}
  <Room room={joinedRoom} self={connection.info().connection!} />
{/if}

<style>
</style>
