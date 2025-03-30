<script lang="ts">
  import {
    DoorOpenSolid,
    DoorClosedSolid,
    PlugCircleXmarkSolid,
    PlugCircleCheckSolid,
    SquarePlusSolid,
    CircleXmarkSolid,
  } from "svelte-awesome-icons";
  type Props = {
    name: "connect" | "disconnect" | "exit" | "enter" | "create" | "x";
    size?: "18" | "24" | "32";
  };
  const map = {
    x: CircleXmarkSolid,
    create: SquarePlusSolid,
    connect: PlugCircleCheckSolid,
    disconnect: PlugCircleXmarkSolid,
    exit: DoorOpenSolid,
    enter: DoorClosedSolid,
  };
  let { name, size = "18" }: Props = $props();
  let Ico = map[name];
</script>

<Ico {size} />
