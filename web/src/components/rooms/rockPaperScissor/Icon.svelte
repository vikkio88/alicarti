<script lang="ts">
  import type { Move } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import {
    HandBackFistSolid,
    HandScissorsSolid,
    HandSolid,
  } from "svelte-awesome-icons";
  type Props = {
    move: Move;
    size?: "18" | "24" | "32";
  };
  const map = {
    rock: HandBackFistSolid,
    paper: HandSolid,
    scissor: HandScissorsSolid,
  };
  let { move, size = "18" }: Props = $props();
  let Ico = map[move];
</script>

<Ico {size} />
