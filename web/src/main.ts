import { mount } from "svelte";
import "beercss/dist/cdn/beer.min.css";
import "./app.css";
import App from "./App.svelte";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
