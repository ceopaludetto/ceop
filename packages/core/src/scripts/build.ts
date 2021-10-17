import { applyPlugins, cleanFolder, getConfigFile } from "@ceop/utils";
import { webpack, Configuration } from "webpack";

import { logger } from "../utils/log";
import { createConfiguration } from "../webpack";

export async function build() {
	const ceopConfiguration = await getConfigFile();

	logger.info("Cleaning dist folder...");
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

	if (ceopConfiguration.mode === "serveronly") {
		let webpackOptions = createConfiguration("server", ceopConfiguration, 0);

		webpackOptions = await applyPlugins(ceopConfiguration, webpackOptions, "server");
		await compile(webpackOptions);
	} else {
		let clientWebpackOptions = createConfiguration("client", ceopConfiguration, 0);
		clientWebpackOptions = await applyPlugins(ceopConfiguration, clientWebpackOptions, "client");

		let serverWebpackOptions = createConfiguration("server", ceopConfiguration, 0);
		serverWebpackOptions = await applyPlugins(ceopConfiguration, serverWebpackOptions, "server");

		await Promise.all([compile(clientWebpackOptions), compile(serverWebpackOptions)]);
	}

	process.exit(0);
}
