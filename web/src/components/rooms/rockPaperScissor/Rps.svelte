<script lang="ts">
  import { type RPSGameState } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import type { RoomProps } from "../props";

  let { room, self, initialState }: RoomProps<RPSGameState> = $props();
  let gameState = $state(initialState);
</script>

<main class="c">
  <pre>{JSON.stringify(gameState, null, 2)}</pre>
</main>
