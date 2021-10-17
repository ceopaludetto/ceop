import { getConfigFile, applyPlugins, cleanFolder } from "@ceop/utils";
import { webpack, Watching, Configuration, Compiler } from "webpack";
import DevServer from "webpack-dev-server";

import { captureLogs, logger } from "../utils/log";
import { parsePorts } from "../utils/port";
import { createConfiguration } from "../webpack";

function compile(configuration: Configuration) {
	let compiler: Compiler;

	try {
		compiler = webpack(configuration);
	} catch (err) {
		logger.error("Failed to compile");
		if ((err as any).message) {
			console.error((err as any).message);
		}
		console.error((err as any).stack || err);
		if ((err as any).details) {
			console.error((err as any).details);
		}

		process.exit(1);
	}

	return compiler;
}

export async function start() {
	const ceopConfiguration = await getConfigFile();

	logger.info("Cleaning dist folder...");
	await cleanFolder("dist");

	logger.trace(`Configuration mode: ${ceopConfiguration.mode}`);

	const { port, devPort } = await parsePorts();

	if (ceopConfiguration.mode === "serveronly") {
		let webpackOptions = createConfiguration("server", ceopConfiguration, devPort);

		webpackOptions = await applyPlugins(ceopConfiguration, webpackOptions, "server");
		const compiler = compile(webpackOptions);

		captureLogs([compiler], port);

		const watching = compiler.watch({}, () => {});

		["SIGINT", "SIGTERM"].forEach((sig) => {
			process.on(sig, () => {
				if (watching) watching.close(() => {});
			});
		});
	} else {
		let clientWebpackOptions = createConfiguration("client", ceopConfiguration, devPort);
		clientWebpackOptions = await applyPlugins(ceopConfiguration, clientWebpackOptions, "client");
		const clientCompiler = compile(clientWebpackOptions);

		let serverWebpackOptions = createConfiguration("server", ceopConfiguration, devPort);
		serverWebpackOptions = await applyPlugins(ceopConfiguration, serverWebpackOptions, "server");
		const serverCompiler = compile(serverWebpackOptions);

		let watching!: Watching;

		captureLogs([clientCompiler, serverCompiler], port, 1, true);

		clientCompiler.hooks.done.tap("ceop", () => {
			if (!watching) watching = serverCompiler.watch({}, () => {});
		});

		const devServer = new DevServer(clientWebpackOptions?.devServer ?? {}, clientCompiler);

		devServer.start();

		["SIGINT", "SIGTERM"].forEach((sig) => {
			process.on(sig, () => {
				if (devServer) devServer.stop();
				if (watching) watching.close(() => {});
			});
		});
	}
}
