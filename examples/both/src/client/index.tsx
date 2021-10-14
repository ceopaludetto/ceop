import { loadableReady } from "@loadable/component";
import { hydrate } from "react-dom";
import { App } from "./App";

const root = document.querySelector("#root");

loadableReady().then(() => {
	hydrate(<App />, root);
});
