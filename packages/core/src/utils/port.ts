import { choosePort, logger } from "@ceop/utils";

export async function parsePorts() {
	const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
	const devPort = process.env.PORT ? parseInt(process.env.PORT, 10) : port + 1;

	const resolve = await choosePort(port);
	const devResolve = await choosePort(devPort);

	if (resolve !== port) {
		logger.info(`Port ${port} is busy, using ${resolve}`);
	}

	return {
		port: resolve,
		devPort: devResolve,
	};
}
