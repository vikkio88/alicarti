export const staticServe: Record<`/${string}`, Response> = {
  "/api/health-check": new Response("All good!"),
  "/": new Response(await Bun.file("./static/index.html").bytes(), {
    headers: {
      "Content-Type": "text/html",
    },
  }),
  "/bundle.js": new Response(await Bun.file("./static/bundle.js").bytes(), {
    headers: {
      "Content-Type": "text/javascript",
    },
  }),
};
