import fs from "fs-extra";
import path from "path";

const cwd: string = process.cwd();

export const context: string = cwd;

export function normalize(file: string): string {
	return path.resolve(cwd, file);
}

export async function exists(file: string): Promise<string | undefined> {
	const fullname = normalize(file);

	if (await fs.pathExists(fullname)) {
		return fullname;
	}

	return undefined;
}

export function resolve<T = any>(file: string): T {
	const m = require(file);

	if (m?.default) return m.default as T;
	return m as T;
}

export async function cleanFolder(folder: string): Promise<void> {
	const fullname = normalize(folder);

	if (await fs.pathExists(fullname)) {
		await fs.emptyDir(fullname);
	}
}
