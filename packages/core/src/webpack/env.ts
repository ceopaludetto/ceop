import { normalize } from "@ceop/utils";
import dotenv from "dotenv";
import expand from "dotenv-expand";

export function getEnv() {
	const { NODE_ENV } = process.env;

	if (!NODE_ENV) throw new Error("NODE_ENV must be specified");

	const files = [normalize(`.env.${NODE_ENV}`), normalize(`.env.${NODE_ENV}.local`)];

	files.forEach((file) => {
		expand(dotenv.config({ path: file }));
	});

	const CEOP = /^CEOP_/i;

	const env = Object.keys(process.env)
		.filter((key) => CEOP.test(key))
		.reduce((acc, key) => {
			acc[key] = process.env[key];
			return acc;
		}, {} as Record<string, any>);

	return env;
}
