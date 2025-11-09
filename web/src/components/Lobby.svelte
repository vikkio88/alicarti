<script lang="ts">
  import { Commands } from "@alicarti/shared";
  import { RoomTypes } from "@alicarti/shared/rooms";
  import { canCreateRoom as check } from "../libs/utils";
  import { connection } from "../libs/ws";
  import Icon from "./shared/Icon.svelte";
  let roomId: string = $state("");
  let roomType: string = $state(RoomTypes.rockPaperScissor);
  let canCreateRoom = check(connection.info().connection);

  let showJoin = $state(false);
  let showCreate = $state(false);
</script>

<main class="responsive fcc">
  <div class="f c g">
    {#if !showJoin && !showCreate}
      <button class="small-round" onclick={() => (showJoin = true)}>
        <Icon name="enter" /> Join Room
      </button>

      <button class="small-round" onclick={() => (showCreate = true)}>
        <Icon name="create" /> Create Room
      </button>
    {/if}

    {#if showJoin}
      <form
        class="fcc"
        onsubmit={(e) => {
          e.preventDefault();
          if (roomId.length < 3) return;
          connection.command(Commands.JOIN_ROOM, { roomId });
        }}
      >
        <div class="field border">
          <input
            name="roomId"
            type="text"
            bind:value={roomId}
            placeholder="Room Id"
            autocomplete="off"
          />
        </div>
        <div>
          <button class="f1" disabled={roomId.length < 3} type="submit">
            <div class="tooltip">Join</div>
            <Icon name="enter" />
          </button>
          <button class="f1" onclick={() => (showJoin = false)}>
            <Icon name="x" />
            <div class="tooltip">Cancel</div>
          </button>
        </div>
      </form>
    {/if}

    {#if showCreate}
      <div class="frc g">
        <div class="row">
          <div class="field suffix border large">
            <span class="helper">Room Type</span>
            <select bind:value={roomType}>
              <option>{RoomTypes.chat}</option>
              <option>{RoomTypes.echo}</option>
              <option>{RoomTypes.rockPaperScissor}</option>
            </select>
            <i>arrow_drop_down</i>
          </div>
        </div>
        <div class="row right-align">
          <button
            disabled={!canCreateRoom}
            onclick={() =>
              connection.command(Commands.CREATE_ROOM, {
                roomType,
              })}
          >
            <Icon name="create" />
            <div class="tooltip">Create</div>
          </button>
          <button class="f1" onclick={() => (showCreate = false)}>
            <Icon name="x" />
            <div class="tooltip">Cancel</div>
          </button>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
      display: flex;
      flex-direction: column;
      padding: 2rem;
  }
</style>
