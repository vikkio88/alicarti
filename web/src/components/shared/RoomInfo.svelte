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

<article>
  <div class="fcc g">
    Room Id
    <h2>
      {room.id}
    </h2>
    <button class="border small-round" onclick={copy}>
      <Icon name="copy" />
    </button>
  </div>
</article>

<style>
</style>
