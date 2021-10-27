import consola from "consola";

export const logger = consola;

export function clear() {
	process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
}
