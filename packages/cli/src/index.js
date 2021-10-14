#! /usr/bin/env node

const { start, build } = require("@ceop/core");
const { Command } = require("commander");

const program = new Command().version("0.0.1");

program
	.command("start")
	.description("Start webpack compilations in dev mode")
	.action(async () => {
		await start();
	});

program
	.command("build")
	.description("Build project")
	.action(async () => {
		await build();
	});

program.parse(process.argv);
