import { cleanFolder, getConfigFile, logger, checkBrowsers } from "@ceop/utils";
import { webpack, Configuration } from "webpack";

import { createConfiguration } from "../webpack";

async function attachCompileLogs(callback: () => Promise<void>) {
	logger.info("Compiling...");

	await callback();

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

	const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

	const browserslist = await checkBrowsers();
	if (ceopConfiguration.mode === "serveronly") {
		await attachCompileLogs(async () => {
			const webpackOptions = await createConfiguration(ceopConfiguration, {
				port,
				target: "server",
				devPort: 0,
				browserslist,
			});

			await compile(webpackOptions);
		});
	} else {
		await attachCompileLogs(async () => {
			const clientWebpackOptions = await createConfiguration(ceopConfiguration, {
				port,
				target: "client",
				devPort: 0,
				browserslist,
			});

			const serverWebpackOptions = await createConfiguration(ceopConfiguration, {
				port,
				target: "server",
				devPort: 0,
				browserslist,
			});

			await Promise.all([compile(clientWebpackOptions), compile(serverWebpackOptions)]);
		});
	}

	process.exit(0);
}
