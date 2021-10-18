import type { Configuration } from "webpack";

export type Target = "client" | "server";

export interface PluginOptions {
	browserslist: string[];
	isDev: boolean;
	target: Target;
}

export type Plugin = (configuration: Configuration, options: PluginOptions) => Configuration;
