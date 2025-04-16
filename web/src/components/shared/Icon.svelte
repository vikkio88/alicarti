<script lang="ts">
  import type { Component } from "svelte";
  import {
    DoorOpenSolid,
    DoorClosedSolid,
    PlugCircleXmarkSolid,
    PlugCircleCheckSolid,
    SquarePlusSolid,
    CircleXmarkSolid,
    CopySolid,
  } from "svelte-awesome-icons";
  type IconName =
    | "create"
    | "connect"
    | "copy"
    | "disconnect"
    | "exit"
    | "enter"
    | "x";
  type Props = {
    name: IconName;
    size?: "18" | "24" | "32" | "32";
  };
  const map: Record<IconName, Component> = {
    create: SquarePlusSolid,
    connect: PlugCircleCheckSolid,
    copy: CopySolid,
    disconnect: PlugCircleXmarkSolid,
    exit: DoorOpenSolid,
    enter: DoorClosedSolid,
    x: CircleXmarkSolid,
  };
  let { name, size = "18" }: Props = $props();
  let Ico = map[name];
</script>

<Ico {size} />
