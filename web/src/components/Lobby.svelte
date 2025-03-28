<script lang="ts">
  import { canCreateRoom as check } from "../libs/utils";
  import { RoomTypes } from "@alicarti/shared/rooms";
  import { connection } from "../libs/ws";
  import { Commands } from "@alicarti/shared";
  let roomId: string = $state("");
  let roomType: string = $state(RoomTypes.chat);
  let canCreateRoom = check(connection.info().connection);

  let showJoin = $state(false);
</script>

<main>
  <div class="f1 f cc">
    <div class="f r g_5">
      <button
        disabled={!canCreateRoom}
        class="f1"
        onclick={() =>
          connection.command(Commands.CREATE_ROOM, {
            roomType,
          })}
      >
        Create Room
      </button>
      <div class="f cc">
        <label for="roomType">Room Type</label>
        <select class="roomTypeSelect f1" name="roomType" bind:value={roomType}>
          <option>{RoomTypes.chat}</option>
          <option>{RoomTypes.echo}</option>
        </select>
      </div>
    </div>
    <div class="f r mg g_5">
      <button class="f1" onclick={() => (showJoin = !showJoin)}>
        {!showJoin ? "Join Room" : "❌"}
      </button>
      {#if showJoin}
        <input type="text" bind:value={roomId} placeholder="Room id" />
        <button
          class="f1"
          disabled={roomId.length < 3}
          onclick={() => connection.command(Commands.JOIN_ROOM, { roomId })}
        >
          Join
        </button>
      {/if}
    </div>
  </div>
</main>

<style>
  input[type="text"] {
    text-align: center;
  }
  .roomTypeSelect {
    min-width: 150px;
    padding: 1rem 0.5rem;
    text-align: center;
    font-size: 1.1rem;
  }
</style>
