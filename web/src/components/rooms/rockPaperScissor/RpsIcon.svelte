<script lang="ts">
  import type { Component } from "svelte";
  import { DiceOneSolid, DiceTwoSolid } from "svelte-awesome-icons";
  type IconName = "one" | "two";
  type Props = {
    name: IconName;
    size?: "18" | "24" | "32" | "32";
  };
  const map: Record<IconName, Component> = {
    one: DiceOneSolid,
    two: DiceTwoSolid,
  };
  let { name, size = "18" }: Props = $props();
  let Ico = map[name];
</script>

<Ico {size} />
