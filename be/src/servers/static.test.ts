import { describe, expect, it } from "bun:test";
import { generateStaticServe, base } from "./static";

describe("Static assets from folder generator", () => {
  it("returns the right set of files", async () => {
    const base = await generateStaticServe("./static/", "", {
      "/api/health-check": new Response("All good!"),
    });
    const result = await generateStaticServe("./static/assets", "assets", base);
    expect(Object.keys(result)).toEqual([
      "/api/health-check",
      "/",
      "/style.css",
      "/assets/index.css",
      "/assets/index.js",
    ]);
  });
});
