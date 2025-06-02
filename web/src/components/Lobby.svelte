<script lang="ts">
  import { canCreateRoom as check } from "../libs/utils";
  import { RoomTypes } from "@alicarti/shared/rooms";
  import { connection } from "../libs/ws";
  import { Commands } from "@alicarti/shared";
  import Icon from "./shared/Icon.svelte";
  let roomId: string = $state("");
  let roomType: string = $state(RoomTypes.rockPaperScissor);
  let canCreateRoom = check(connection.info().connection);

  let showJoin = $state(false);
</script>

<main class="responsive">
  <article class="medium middle-align center-align">
    <div>
      <div class="row join" class:showJoin={!showJoin}>
        {#if showJoin}
          <form
            onsubmit={(e) => {
              e.preventDefault();
              if (roomId.length < 3) return;
              connection.command(Commands.JOIN_ROOM, { roomId });
            }}
          >
            <div class="field">
              <input
                name="roomId"
                type="text"
                bind:value={roomId}
                placeholder="Room Id"
              />
            </div>
            <button class="f1" disabled={roomId.length < 3} type="submit">
              <div class="tooltip">Join</div>
              <Icon name="enter" />
            </button>
          </form>
        {/if}
        <button onclick={() => (showJoin = !showJoin)}>
          {#if showJoin}
            <Icon name="x" />
            <div class="tooltip">Cancel</div>
          {:else}
            <Icon name="enter" /> Room
            <div class="tooltip right">Join Room</div>
          {/if}
        </button>
      </div>

      <div class="row create">
        <fieldset>
          <div class="row">
            <div class="field suffix border large">
              <span class="helper">Room Type</span>
              <select
                bind:value={roomType}
              >
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
              <Icon name="create" /> Room
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  </article>
</main>

<style>
  form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .join {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .showJoin {
    display: block;
    padding-left: 0.5rem;
  }
</style>
