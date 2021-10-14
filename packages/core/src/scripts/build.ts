import { Logger } from "@ceop/logger";
import { applyPlugins, cleanFolder, getConfigFile } from "@ceop/utils";
import { webpack, Configuration } from "webpack";

import { createConfiguration } from "../webpack";

export async function build() {
	const ceopConfiguration = await getConfigFile();

	Logger.log("cleaning dist folder...");
	await cleanFolder("dist");
	Logger.success("cleaned");

	function compile(configuration: Configuration) {
		return new Promise<void>((resolve, reject) => {
			webpack(configuration, (error) => {
				if (error) return reject(error);

				return resolve();
			});
		});
	}

	Logger.verbose(`configuration mode: ${ceopConfiguration.mode}`);

	if (ceopConfiguration.mode === "serveronly") {
		Logger.log("compiling...");
		let webpackOptions = createConfiguration("server", false, ceopConfiguration);

		webpackOptions = await applyPlugins(ceopConfiguration, webpackOptions, "server", false);
		await compile(webpackOptions);

		Logger.success("compiled");
	} else {
		Logger.log("compiling...");
		let clientWebpackOptions = createConfiguration("client", false, ceopConfiguration);
		clientWebpackOptions = await applyPlugins(ceopConfiguration, clientWebpackOptions, "client", false);

		let serverWebpackOptions = createConfiguration("server", false, ceopConfiguration);
		serverWebpackOptions = await applyPlugins(ceopConfiguration, serverWebpackOptions, "server", false);

		await Promise.all([compile(clientWebpackOptions), compile(serverWebpackOptions)]);

		Logger.success("compiled");
	}

	process.exit(0);
}
