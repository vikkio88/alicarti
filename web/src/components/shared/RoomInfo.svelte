<script lang="ts">
  import type { Room } from "@alicarti/shared/rooms";
  import Icon from "./Icon.svelte";
  import { copyToClipboard } from "../../libs/clipboard";
  import { uiState } from "../../store/ui.svelte";

  type Props = {
    room: Room;
  };

  const { room }: Props = $props();
  function copy() {
    copyToClipboard(room.id, () => uiState.snackMessage("Room Id copied."));
  }
</script>

<div class="f rc pd g">
  <div class="f cc">
    Room Id
    <h1>
      {room.id}
    </h1>
  </div>
  <button class="transparent" onclick={copy}>
    <Icon name="copy" />
  </button>
</div>

<style>
</style>
