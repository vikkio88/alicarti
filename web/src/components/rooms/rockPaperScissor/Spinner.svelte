<script lang="ts">
  import type { Move } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import Icon from "./Icon.svelte";
  import { onMount } from "svelte";
  let move: Move = $state("rock");
  onMount(() => {
    const i = setInterval(() => {
      move = move === "rock" ? "paper" : move === "paper" ? "scissor" : "rock";
    }, 1500);
    return () => clearInterval(i);
  });
</script>

<div class="anim_pulse">
  <Icon {move} size="48" />
</div>
