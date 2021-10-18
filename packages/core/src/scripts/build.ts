import { applyPlugins, cleanFolder, getConfigFile, logger, checkBrowsers, clear } from "@ceop/utils";
import { webpack, Configuration } from "webpack";

import { createConfiguration } from "../webpack";

async function attachCompileLogs(callback: () => Promise<void>) {
	logger.info("Compiling...");

	await callback();

	clear();
	logger.success("Compiled successfully");
}

export async function build() {
	const ceopConfiguration = await getConfigFile();

	await cleanFolder("dist");

	function compile(configuration: Configuration) {
		return new Promise<void>((resolve, reject) => {
			webpack(configuration, (error) => {
				if (error) return reject(error);

				return resolve();
			});
		});
	}

	logger.trace(`Configuration mode: ${ceopConfiguration.mode}`);

	const browserslist = await checkBrowsers();
	if (ceopConfiguration.mode === "serveronly") {
		await attachCompileLogs(async () => {
			let webpackOptions = createConfiguration(ceopConfiguration, { target: "server", devPort: 0, browserslist });

			webpackOptions = await applyPlugins(ceopConfiguration, webpackOptions, "server", browserslist);
			await compile(webpackOptions);
		});
	} else {
		await attachCompileLogs(async () => {
			let clientWebpackOptions = createConfiguration(ceopConfiguration, { target: "client", devPort: 0, browserslist });
			clientWebpackOptions = await applyPlugins(ceopConfiguration, clientWebpackOptions, "client", browserslist);

			let serverWebpackOptions = createConfiguration(ceopConfiguration, { target: "server", devPort: 0, browserslist });
			serverWebpackOptions = await applyPlugins(ceopConfiguration, serverWebpackOptions, "server", browserslist);

			await Promise.all([compile(clientWebpackOptions), compile(serverWebpackOptions)]);
		});
	}

	process.exit(0);
}
