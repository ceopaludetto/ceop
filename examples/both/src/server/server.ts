import express from "express";

import { render } from "./render";

const app = express();

app.get("*", (request, response) => {
	return response.send(render());
});

export { app };
