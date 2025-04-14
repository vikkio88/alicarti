<script lang="ts">
  import type { Move } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import Icon from "./Icon.svelte";
  import { onMount } from "svelte";
  let move: Move = $state("rock");
  onMount(() => {
    const i = setInterval(() => {
      move = move === "rock" ? "paper" : move === "paper" ? "scissor" : "rock";
    }, 1000);
    return () => clearInterval(i);
  });
</script>

<div class="anim_pulse">
  {#if move === "rock"}
    <Icon move="rock" size="32" />
  {:else if move === "paper"}
    <Icon move="paper" size="32" />
  {:else}
    <Icon move="scissor" size="32" />
  {/if}
</div>
