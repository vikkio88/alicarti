<script lang="ts">
  import type {
    Score,
    RoundResult,
  } from "@alicarti/shared/rooms/rockpaperscissor/config";

  type Props = {
    result: RoundResult;
    score: Score;
    self: "one" | "two";
  };

  let { result, score, self }: Props = $props();
  let isWinner = result.winner === self;
  let isDraw = result.draw;
</script>

<div class="f cc">
  {#if isDraw}
    <h2>Draw</h2>
  {:else if isWinner}
    <h2>You Win</h2>
  {:else}
    <h2>You Lose</h2>
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
