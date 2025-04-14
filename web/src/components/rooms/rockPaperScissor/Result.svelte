<script lang="ts">
  import type {
    Score,
    RoundResult,
  } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import RPSIcon from "./Icon.svelte";

  type Props = {
    result?: RoundResult;
    score: Score;
    self: "one" | "two";
  };

  let { result, score, self }: Props = $props();
  let other: "one" | "two" = self === "one" ? "two" : "one";
</script>

<div class="f cc">
  {#if result}
    {#if result.moves}
      <h2>You</h2>
      <RPSIcon move={result.moves[self]} />
      <h2>Them: {`${result.moves[other]}`}</h2>
      <RPSIcon move={result.moves[other]} />
    {/if}
    {#if result.draw}
      <h2>Draw</h2>
    {:else if result.winner === self}
      <h2>You Win</h2>
    {:else}
      <h2>You Lose</h2>
    {/if}
  {/if}
  <div class="f cc">
    <h2>Score</h2>
    <h3>
      You: {score[self]}
    </h3>
    <h3>
      Them: {score[self === "one" ? "two" : "one"]}
    </h3>
    <h3>
      Draws: {score.draws}
    </h3>
  </div>
</div>
