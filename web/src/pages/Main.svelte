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
  import RoomManager from "../components/RoomManager.svelte";
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
            initialState = commandResult.data.initialState;
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

  let initialState: unknown = $state(undefined);
  let joinedRoom: JoinedRoom | null = $state(null);
  let roomId: string = $state("");
  let roomType: string = $state(RoomTypes.echo);
  let canCreateRoom = check(connection.info().connection);
</script>

<div class="topBar">
  {connection.info().connection?.socketId}
  <button class="small" onclick={disconnect}>❌</button>
</div>

{#if !joinedRoom}
  <div class="f1 f cc g">
    <div class="f r g_5">
      <button
        disabled={!canCreateRoom}
        class="small"
        onclick={() =>
          connection.command(Commands.CREATE_ROOM, {
            roomType,
          })}
      >
        Create Room
      </button>
      <select class="roomTypeSelect" name="roomType" bind:value={roomType}>
        <option selected>{RoomTypes.echo}</option>
        <option>{RoomTypes.chat}</option>
      </select>
    </div>
    <div class="f rc g_5">
      <button
        class="small"
        disabled={roomId.length < 3}
        onclick={() => connection.command(Commands.JOIN_ROOM, { roomId })}
      >
        Join Room
      </button>
      <input type="text" bind:value={roomId} placeholder="Room id" />
    </div>
  </div>
{:else}
  <div class="f1">
    <RoomManager
      room={joinedRoom}
      self={connection.info().connection!}
      {initialState}
    />
  </div>
{/if}

<style>
  .topBar {
    position: absolute;
    top: 0;
    right: 0;
  }

  input[type="text"] {
    text-align: center;
  }
  .roomTypeSelect {
    min-width: 150px;
    text-align: center;
    font-size: 1.1rem;
  }
</style>
