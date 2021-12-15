import { CONFIGURATION_FILES } from "../constants";
import { CeopConfiguration, validationSchema } from "../helpers/validation";
import { exists, resolve, normalize } from "./path";

export async function hasConfigFile(): Promise<string | undefined> {
	const files = await Promise.all(CONFIGURATION_FILES.map(async (file) => exists(file)));

	if (files.some((file) => !!file)) {
		const filenames = files.filter((file) => !!file);

		if (filenames.length === 0) return undefined;

		if (filenames.length > 1) {
			throw new Error("Only one configuration file is permitted");
		}

		return filenames[0];
	}

	return undefined;
}

export async function getConfigFile(): Promise<CeopConfiguration> {
	const file = await hasConfigFile();
	if (!file)
		return {
			mode: "both",
			plugins: [],
			entry: { client: normalize("src/client/index.tsx"), server: normalize("src/server/index.ts") },
		};

	try {
		const configuration = await resolve(file);
		const validated = await validationSchema.validate(configuration, { abortEarly: true });

		return validated as CeopConfiguration;
	} catch (error) {
		throw new Error("Fail to retrieve configuration file");
	}
}
