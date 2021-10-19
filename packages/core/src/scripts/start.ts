import { getConfigFile, cleanFolder, logger, checkBrowsers } from "@ceop/utils";
import { webpack, Watching, Configuration, Compiler } from "webpack";
import DevServer from "webpack-dev-server";

import { captureLogs } from "../utils/log";
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

	await cleanFolder("dist");

	logger.trace(`Configuration mode: ${ceopConfiguration.mode}`);

	const { port, devPort } = await parsePorts();

	const browserslist = await checkBrowsers();
	if (ceopConfiguration.mode === "serveronly") {
		const webpackOptions = await createConfiguration(ceopConfiguration, {
			port,
			devPort,
			target: "server",
			browserslist,
		});
		const compiler = compile(webpackOptions);

		captureLogs([compiler], port);

		const watching = compiler.watch({}, () => {});

		["SIGINT", "SIGTERM"].forEach((sig) => {
			process.on(sig, () => {
				if (watching) watching.close(() => {});
			});
		});
	} else {
		const clientWebpackOptions = await createConfiguration(ceopConfiguration, {
			port,
			devPort,
			target: "client",
			browserslist,
		});
		const clientCompiler = compile(clientWebpackOptions);

		const serverWebpackOptions = await createConfiguration(ceopConfiguration, {
			port,
			devPort,
			target: "server",
			browserslist,
		});
		const serverCompiler = compile(serverWebpackOptions);

		let watching!: Watching;

		captureLogs([serverCompiler], port);

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
