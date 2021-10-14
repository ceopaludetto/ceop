import fs from "fs-extra";
import path from "path";

const cwd = process.cwd();

export const context = cwd;

export function normalize(file: string) {
	return path.resolve(cwd, file);
}

export async function exists(file: string) {
	const fullname = normalize(file);

	if (await fs.pathExists(fullname)) {
		return fullname;
	}

	return undefined;
}

export async function resolve<T = any>(file: string) {
	const m = await import(normalize(file));

	if (m.default) return m.default as Promise<T>;
	return m as Promise<T>;
}

export async function cleanFolder(folder: string) {
	const fullname = normalize(folder);

	if (await fs.pathExists(fullname)) {
		await fs.emptyDir(fullname);
	}

	return undefined;
}
