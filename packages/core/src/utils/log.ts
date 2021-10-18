import { normalize, clear, logger } from "@ceop/utils";
import type { Compiler } from "webpack";
import formatMessages, { Messages } from "webpack-format-messages";

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

export function captureLogs(compilers: Compiler[], port: number, server = 0) {
	let messages: Messages = { errors: [], warnings: [] };
	const done = compilers.map(() => false);

	if (!compilers.length) return;
	const client = normalize("src/client");

	const key = "ceop:logs";

	compilers[server].hooks.invalid.tap(key, () => {
		clear();
		logger.info("Compiling...");

		messages = { errors: [], warnings: [] };
		done.fill(false);
	});

	compilers.forEach((compiler, index) => {
		compiler.hooks.watchRun.tap(key, (compilation) => {
			if (compilation.modifiedFiles) {
				const files = Array.from(compilation.modifiedFiles);

				if (files.includes(client)) return;
				done.fill(true);
			}
		});

		compiler.hooks.done.tap(key, (stats) => {
			done[index] = true;

			const formattedMessages = formatMessages(stats);

			messages.errors = [...messages.errors, ...formattedMessages.errors];
			messages.warnings = [...messages.warnings, ...formattedMessages.warnings];

			if (done.every((compilation) => compilation === true)) tryPrint(messages, port);
		});
	});
}
