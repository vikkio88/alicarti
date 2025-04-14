export const staticServe: Record<`/${string}`, Response> = {
  "/api/health-check": new Response("All good!"),
  "/": new Response(await Bun.file("./static/index.html").bytes(), {
    headers: {
      "Content-Type": "text/html",
    },
  }),
  "/assets/index.js": new Response(await Bun.file("./static/assets/index.js").bytes(), {
    headers: {
      "Content-Type": "text/javascript",
    },
  }),
  "/assets/index.css": new Response(await Bun.file("./static/assets/index.css").bytes(), {
    headers: {
      "Content-Type": "text/css",
    },
  }),
  "/style.css": new Response(await Bun.file("./static/style.css").bytes(), {
    headers: {
      "Content-Type": "text/css",
    },
  }),
};
