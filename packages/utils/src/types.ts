import type { Configuration } from "webpack";

export type Target = "client" | "server";

export interface IPluginOptions {
	browserslist: string[];
	isDev: boolean;
	target: Target;
}

export type Plugin = (configuration: Configuration, options: IPluginOptions) => Configuration;
