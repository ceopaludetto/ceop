import { normalize, clear } from "@ceop/utils";
import consola from "consola";
import type { Compiler } from "webpack";
import formatMessages, { Messages } from "webpack-format-messages";

export const logger = consola;

function tryPrint(messages: Messages, port: number) {
	clear();

	if (!messages.errors.length && !messages.warnings.length) {
		logger.success("Compiled successfully!");
		console.log();
		logger.log(`Server is running in port ${port}`);
	}

	if (messages.errors.length) {
		logger.error("Failed to compile");
		messages.errors.forEach((e) => console.error(e));
		return;
	}

	if (messages.warnings.length) {
		logger.warn("Compiled with warnings");
		messages.warnings.forEach((e) => console.warn(e));
	}
}

export function captureLogs(compilers: Compiler[], port: number, server = 0, filterClient = false) {
	let messages: Messages = { errors: [], warnings: [] };
	const done = compilers.map(() => false);

	if (!compilers.length) return;
	const client = normalize("src/client");

	compilers[server].hooks.invalid.tap("ceop:logs", () => {
		clear();
		logger.info("Compiling...");

		messages = { errors: [], warnings: [] };
		done.fill(false);
	});

	compilers.forEach((compiler, index) => {
		compiler.hooks.watchRun.tap("ceop:logs", (compilation) => {
			if (compilation.modifiedFiles) {
				const files = Array.from(compilation.modifiedFiles);

				if (files.includes(client)) return;
				done.fill(true);
			}
		});

		compiler.hooks.done.tap("ceop:logs", (stats) => {
			done[index] = true;

			const formattedMessages = formatMessages(stats);

			if (filterClient && server === index) {
				formattedMessages.errors = formattedMessages.errors.filter((error) => !error.includes(client));
			}

			messages.errors = [...messages.errors, ...formattedMessages.errors];
			messages.warnings = [...messages.warnings, ...formattedMessages.warnings];

			if (done.every((compilation) => compilation === true)) tryPrint(messages, port);
		});
	});
}
