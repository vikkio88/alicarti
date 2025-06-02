import { Glob } from "bun";
import path from "path";

export const base: Record<`/${string}`, Response> = {
  "/api/health-check": new Response("All good!"),
};

export async function generateStaticServe(
  directory: string,
  mappedUri: string,
  base: Record<`/${string}`, Response> = {}
) {
  const serve: Record<`/${string}`, Response> = { ...base };
  const globHtml = new Glob(`*.html`);
  for (const file of globHtml.scanSync(directory)) {
    const bytes = await Bun.file(`${directory}/${file}`).bytes();

    const mappedHtml = (
      file === "index.html" ? "/" : path.join("/", mappedUri, file)
    ) as `/${string}`;

    serve[mappedHtml] = new Response(bytes, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const globCss = new Glob(`*.css`);
  for (const file of globCss.scanSync(directory)) {
    const bytes = await Bun.file(`${directory}/${file}`).bytes();
    serve[path.join("/", mappedUri, file) as `/${string}`] = new Response(
      bytes,
      {
        headers: {
          "Content-Type": "text/css",
        },
      }
    );
  }

  const globJs = new Glob(`*.js`);
  for (const file of globJs.scanSync(directory)) {
    const bytes = await Bun.file(`${directory}/${file}`).bytes();
    serve[path.join("/", mappedUri, file) as `/${string}`] = new Response(
      bytes,
      {
        headers: {
          "Content-Type": "text/javascript",
        },
      }
    );
  }

  const globWoff2 = new Glob(`*.woff2`);
  for (const file of globWoff2.scanSync(directory)) {
    const bytes = await Bun.file(`${directory}/${file}`).bytes();
    serve[path.join("/", mappedUri, file) as `/${string}`] = new Response(
      bytes,
      {
        headers: {
          "Content-Type": "font/woff2",
        },
      }
    );
  }
  return serve;
}
