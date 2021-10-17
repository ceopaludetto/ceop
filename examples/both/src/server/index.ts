import http from "http";
import { app } from "./server";

const server = http.createServer(app);
let curr = app;

server.listen(3000, () => console.log("started"));

if (module.hot) {
	module.hot.accept("./server", () => {
		server.removeListener("request", curr);
		server.on("request", app);
		curr = app;
	});
}
