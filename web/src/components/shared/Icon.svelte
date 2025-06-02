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
    CrownSolid,
    GamepadSolid,
    EyeSolid,
  } from "svelte-awesome-icons";
  type IconName =
    | "create"
    | "connect"
    | "copy"
    | "crown"
    | "disconnect"
    | "exit"
    | "eye"
    | "enter"
    | "gamepad"
    | "x";
  type Props = {
    name: IconName;
    size?: "18" | "24" | "32" | "32";
  };
  const map: Record<IconName, Component> = {
    create: SquarePlusSolid,
    connect: PlugCircleCheckSolid,
    copy: CopySolid,
    crown: CrownSolid,
    disconnect: PlugCircleXmarkSolid,
    enter: DoorClosedSolid,
    eye: EyeSolid,
    exit: DoorOpenSolid,
    gamepad: GamepadSolid,
    x: CircleXmarkSolid,
  };
  let { name, size = "18" }: Props = $props();
  let Ico = map[name];
</script>

<i>
  <Ico {size} />
</i>
