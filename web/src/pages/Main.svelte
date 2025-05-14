<script lang="ts">
  import {
    Commands,
    type CommandPayload,
    type JoinedRoomResponsePayload,
    type WsMessage,
  } from "@alicarti/shared";
  import { type Room as JoinedRoom, type Room } from "@alicarti/shared/rooms";

  import { connection } from "../libs/ws";

  import RoomManager from "../components/RoomManager.svelte";
  import Lobby from "../components/Lobby.svelte";
  import { ws } from "../store/wsState.svelte";

  connection.addMessageHandler((message: WsMessage<any>) => {
    if (message.type === "command_result") {
      const commandResult = message.payload as CommandPayload<any>;
      switch (commandResult.command) {
        case Commands.JOIN_ROOM:
        case Commands.CREATE_ROOM: {
          if (commandResult.success) {
            const payload =
              commandResult.data as JoinedRoomResponsePayload<any>;
            initialState = payload.initialState;
            joinedRoom = payload.room;
            ws.joinRoom(joinedRoom as Room);
            break;
          }

          if (!commandResult.success) {
            console.error(`could not join the room`, { commandResult });
            //TODO: Handle rejection maybe with the global toast
            break;
          }
        }
        case Commands.LEAVE_ROOM: {
          if (commandResult.success) {
            joinedRoom = null;
            ws.leaveRoom();
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
