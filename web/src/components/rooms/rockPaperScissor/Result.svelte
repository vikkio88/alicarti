<script lang="ts">
  import type {
    Score,
    RoundResult,
    Phase,
  } from "@alicarti/shared/rooms/rockpaperscissor/config";
  import RPSIcon from "./Icon.svelte";

  type Props = {
    result?: RoundResult;
    score: Score;
    self: "one" | "two";
    phase: Phase
  };

  let { result, score, self, phase }: Props = $props();
  let other: "one" | "two" = self === "one" ? "two" : "one";

  let scoreHeader = $derived(phase === "over" ? "Final Score" : "Score");
</script>

<div class="f cc">
  {#if result}
    {#if result.moves}
      <div class="f rc mg g">
        <div class="f1 f c">
          <h2>You</h2>
          <RPSIcon size="48" move={result.moves[self]} />
        </div>
        <div class="f1 f c">
          <h2>Them</h2>
          <RPSIcon size="48" move={result.moves[other]} />
        </div>
      </div>
    {/if}
    <div class="result">
      {#if result.draw}
        <h2>Draw</h2>
      {:else if result.winner === self}
        <h2>You Win</h2>
      {:else}
        <h2>You Lose</h2>
      {/if}
    </div>
  {/if}
  <div class="f cc">
    <h1>
      {scoreHeader}
    </h1>
    <div class="f rc g">
      <h3>You</h3>
      <h3>
        {score[self]}
        -
        {score[self === "one" ? "two" : "one"]}
      </h3>
      <h3>Them</h3>
    </div>
    <h2>
      Draws: {score.draws}
    </h2>
  </div>
</div>

<style>
  .result h2 {
    font-size: 3rem;
    margin: 2rem 0;
  }
</style>
