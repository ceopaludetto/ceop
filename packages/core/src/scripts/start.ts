import { Logger } from "@ceop/logger";
import { getConfigFile, applyPlugins, cleanFolder } from "@ceop/utils";
import { webpack, Watching } from "webpack";
import DevServer from "webpack-dev-server";

import { createConfiguration } from "../webpack";

export async function start() {
	const ceopConfiguration = await getConfigFile();

	Logger.log("cleaning dist folder...");
	await cleanFolder("dist");
	Logger.success("cleaned");

	Logger.verbose(`configuration mode: ${ceopConfiguration.mode}`);

	if (ceopConfiguration.mode === "serveronly") {
		let webpackOptions = createConfiguration("server", true, ceopConfiguration);

		webpackOptions = await applyPlugins(ceopConfiguration, webpackOptions, "server", true);
		const compiler = webpack(webpackOptions);

		const watching = compiler.watch({}, () => {});

		["SIGINT", "SIGTERM"].forEach((sig) => {
			process.on(sig, () => {
				if (watching) watching.close(() => {});
			});
		});
	} else {
		let clientWebpackOptions = createConfiguration("client", true, ceopConfiguration);
		clientWebpackOptions = await applyPlugins(ceopConfiguration, clientWebpackOptions, "client", true);
		const clientCompiler = webpack(clientWebpackOptions);

		let serverWebpackOptions = createConfiguration("server", true, ceopConfiguration);
		serverWebpackOptions = await applyPlugins(ceopConfiguration, serverWebpackOptions, "server", true);
		const serverCompiler = webpack(serverWebpackOptions);

		let watching!: Watching;

		clientCompiler.hooks.beforeCompile.tap("ceop", () => {
			Logger.clear();
			Logger.log("compiling...");
		});

		clientCompiler.hooks.done.tap("ceop", () => {
			if (!watching) watching = serverCompiler.watch({}, () => {});
			Logger.clear();
			Logger.success("compiled");
		});

		const devServer = new DevServer(clientWebpackOptions?.devServer ?? { client: { logging: "none" } }, clientCompiler);

		devServer.start();

		["SIGINT", "SIGTERM"].forEach((sig) => {
			process.on(sig, () => {
				if (devServer) devServer.stop();
				if (watching) watching.close(() => {});
			});
		});
	}
}
