import chalk from "chalk";

export class Logger {
	public static log(message: string) {
		console.log(`${chalk.cyan("info")} ${chalk.reset(message)}`);
	}

	public static success(message: string) {
		console.log(`${chalk.green("good")} ${chalk.reset(message)}`);
	}

	public static error(message: string) {
		console.log(`${chalk.red("error")} ${chalk.reset(message)}`);
	}

	public static verbose(message: string) {
		console.log(`${chalk.magenta("verb")} ${chalk.reset(message)}`);
	}

	public static clear() {
		process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
	}
}
