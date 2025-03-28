<script lang="ts">
  import {
    Commands,
    type CommandPayload,
    type WsMessage,
  } from "@alicarti/shared";
  import {
    type Room as JoinedRoom,
    type RoomType,
  } from "@alicarti/shared/rooms";

  import { connection } from "../libs/ws";

  import RoomManager from "../components/RoomManager.svelte";
  import Lobby from "../components/Lobby.svelte";
  import { appState } from "../store/appState.svelte";

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
            appState.joinedRoom(joinedRoom);
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

  let initialState: unknown = $state(undefined);
  let joinedRoom: JoinedRoom | null = $state(null);
</script>

{#if !joinedRoom}
  <Lobby />
{:else}
  <RoomManager
    room={joinedRoom}
    self={connection.info().connection!}
    {initialState}
  />
{/if}
